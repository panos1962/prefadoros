<?php
class Sxesi {
	public $login;
	public $onoma;
	public $online;
	public $diathesimos;
	public $status;

	public static function is_online($idle) {
		return ($idle < XRONOS_PEKTIS_IDLE_MAX);
	}

	public function __construct() {
		$this->login = '';
		$this->onoma = '';
		$this->online = FALSE;
		$this->diathesimos = FALSE;
		$this->status = '';
	}

	public function set_from_dbrow($row, $energos, $status = '') {
		$this->login = $row['login'];
		$this->onoma = $row['όνομα'];
		$this->online = self::is_online($row['idle']);
		$this->diathesimos = array_key_exists($row['login'], $energos);
		$this->status = $status;
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 5) {
			return(FALSE);
		}

		$nf = 0;
		$this->login = $cols[$nf++];
		$this->onoma = $cols[$nf++];
		$this->online = $cols[$nf++];
		$this->diathesimos = $cols[$nf++];
		$this->status = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->login . "\t" . $this->onoma . "\t" .
			($this->online ? 1 : 0) . "\t" .
			($this->diathesimos ? 1 : 0) . "\t" . $this->status);
	}

	public function json_data() {
		if ($this->online) {
			if ($this->diathesimos) {
				$ol = 2;
			}
			else {
				$ol = 1;
			}
		}
		else {
			$ol = 0;
		}

		print "{l:'" . $this->login . "',n:'" . $this->onoma .
			"',o:" . $ol . ",s:'" . $this->status . "'}";
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα όλων των παικτών
	// που φαίνονται να συμμετέχουν ως παίκτες σε ενεργά τραπέζια.

	public static function energos_pektis() {
		global $globals;
		$pektis = array();
		$query = "SELECT `παίκτης1`, `παίκτης2`, `παίκτης3` " .
			"FROM `τραπέζι` WHERE `τέλος` IS NULL";
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			for ($i = 0; $i < 3; $i++) {
				$pektis[$row[$i]] = TRUE;
			}
		}

		return($pektis);
	}
}

function process_sxesi() {
	global $globals;
	global $sinedria;

	$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

	$peknpat = NULL;
	$query = "SELECT `peknpat`, `pekstat` FROM `συνεδρία` " .
		"WHERE `κωδικός` = " . $sinedria;
	$result = $globals->sql_query($query);
	if ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		@mysqli_free_result($result);
		if ($row[0] != '') {
			$peknpat = "%" . $globals->asfales($row[0]) . "%";
		}
		$pekstat = $globals->asfales($row[1]);
	}

	$query1 = "SELECT `login`, `όνομα`, " .
		"(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) AS `idle` " .
		"FROM `παίκτης` WHERE 1 ";

	if (isset($peknpat)) {
		$query1 .= "AND ((`όνομα` LIKE '" . $peknpat . "') OR " .
			"(`login` LIKE '" . $peknpat . "')) ";
	}

	switch ($pekstat) {
	case 'ΔΙΑΘΕΣΙΜΟΙ':
	case 'ONLINE':
		$online = TRUE;
		break;
	default:
		$online = FALSE;
		break;
	}

	$query2 = " ORDER BY `login`";

	// Δημιουργούμε λίστα όλων των ενεργών παικτών, ώστε να μπορούμε
	// να μαρκάκρουμε τους ενεργόυς παίκτες.
	$energos = Sxesi::energos_pektis();

	// Δημιουργούμε λίστα των παικτών που πρόκειται να επιστραφεί.
	// Η λίστα θα "γεμίσει" με δεδομένα αμέσως μετά.
	$sxesi = array();

	// Πρώτα θα εμφανιστούν οι παίκτες που σχετίζονται ως "φίλοι" με
	// τον παίκτη.
	$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
		"(`παίκτης` LIKE " . $slogin . ") AND " .
		"(`status` LIKE 'ΦΙΛΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		if ((!$online) || ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX)) {
			$s = new Sxesi;
			$s->set_from_dbrow($row, $energos, 'F');
			$sxesi[] = $s;
		}
	}

	// Αν έχει δοθεί name pattern ή κατάσταση online/available, τότε επιλέγω και
	// μη σχετιζόμενους παίκτες.
	if (isset($peknpat) || $online) {
		$query = $query1 . "AND (`login` NOT IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
			"(`παίκτης` LIKE " . $slogin . ")))" . $query2;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			if ((!$online) || ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX)) {
				$s = new Sxesi;
				$s->set_from_dbrow($row, $energos);
				$sxesi[] = $s;
			}
		}
	}

	// Τέλος, εμφανίζονται οι παίκτες που έχουν "αποκλειστεί" από τον παίκτη.
	$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
		"(`παίκτης` LIKE " . $slogin . ") AND " .
		"(`status` LIKE 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		if ((!$online) || ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX)) {
			$s = new Sxesi;
			$s->set_from_dbrow($row, $energos, 'B');
			$sxesi[] = $s;
		}
	}

	return $sxesi;
}
?>
