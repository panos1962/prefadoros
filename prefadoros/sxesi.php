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
		$this->onoma = $row['onoma'];
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
			$ol = ($this->diathesimos ? 2 : 1);
		}
		else {
			$ol = 0;
		}

		print "{l:'" . $this->login . "',n:'" . $this->onoma .
			"',o:" . $ol . ",s:'" . $this->status . "'}";
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα που περιέχει τους φίλους
	// και τους αποκλεισμένους του παίκτη. Η λίστα είναι δεικτοδοτημένη με
	// με τα login names των σχετιζομένων με αντίστοιχη τιμή το είδος σχέσης.

	private static function sxetizomenos() {
		global $globals;
		$sxetizomenos = array();
		$query = "SELECT `sxetizomenos`, `status` FROM `sxesi` " .
			"WHERE `pektis` LIKE " . $globals->pektis->slogin;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			$sxetizomenos[$row[0]] = $row[1];
		}

		return($sxetizomenos);
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα όλων των παικτών
	// που φαίνονται να συμμετέχουν ως παίκτες σε ενεργά τραπέζια.

	public static function energos_pektis() {
		global $globals;
		$pektis = array();
		$query = "SELECT `pektis1`, `pektis2`, `pektis3` " .
			"FROM `trapezi` WHERE `telos` IS NULL";
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			for ($i = 0; $i < 3; $i++) {
				$pektis[$row[$i]] = TRUE;
			}
		}

		return($pektis);
	}

	public static function diavase($fh, &$slist) {
		while ($line = Globals::get_line_end($fh)) {
			$s = new Sxesi();
			if ($s->set_from_file($line)) {
				$slist[] = $s;
			}
		}
	}

	public static function grapse($fh, &$slist) {
		Globals::put_line($fh, "@SXESI@");
		$n = count($slist);
		for ($i = 0; $i < $n; $i++) {
			$slist[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	public static function print_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::print_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		// Κατασκευάζω τα arrays "cdata" και "pdata" που περιέχουν τα
		// δεδομένα των παικτών δεικτοδοτημένα με τα login names.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata[$curr[$i]->login] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata[$prev[$i]->login] = &$prev[$i];
		}

		// Διατρέχω τώρα παλαιά και νέα δεδομένα με σκοπό να ελέγξω
		// τις διαφορές και να τις καταχωρήσω στα arrays "new", "mod"
		// και "del".

		$ndif = 0;
		$new = array();
		$mod = array();
		foreach($cdata as $login => $data) {
			if (!array_key_exists($login, $pdata)) {
				$new[] = &$cdata[$login];
				$ndif++;
			}
			elseif ($cdata[$login] != $pdata[$login]) {
				$mod[$login] = &$cdata[$login];
				$ndif++;
			}
		}

		$del = array();
		foreach($pdata as $login => $data) {
			if (!array_key_exists($login, $cdata)) {
				$del[$login] = TRUE;
				$ndif++;
			}
		}

		// Αν οι διαφορές που προέκυψαν μεταξύ παλαιών και νέων δεδομένων
		// είναι περισσότερες από τα ίδια τα δεδομένα, τότε επιστρέφω όλα
		// τα δεδομένα.

		if ($ndif >= $ncurr) {
			self::print_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",sxesiDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",sxesiMod:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",sxesiNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$slist) {
		$koma = '';
		$n = count($slist);
		print ",sxesi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$slist[$i]->json_data();
		}
		print "]";
	}

	public static function process() {
		global $globals;
		global $sinedria;

		$available = FALSE;
		switch ($sinedria->pekstat) {
		case 'ΔΙΑΘΕΣΙΜΟΙ':
			$available = TRUE;
		case 'ONLINE':
			$online = TRUE;
			break;
		default:
			$online = FALSE;
			break;
		}

		$query = "SELECT `login`, `onoma`, " .
			"(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) AS `idle` FROM `pektis` ";
		if (isset($sinedria->peknpat)) {
			$query .= "WHERE (`onoma` LIKE '" . $sinedria->peknpat . "') OR " .
				"(`login` LIKE '" . $sinedria->peknpat . "') ";
		}
		elseif ($online) {
			$query .= "WHERE (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) <= " .
				XRONOS_PEKTIS_IDLE_MAX . " ";
		}
		else {
			$query .= "WHERE (`login` IN (SELECT `sxetizomenos` FROM `sxesi` " .
				"WHERE `pektis` LIKE " . $globals->pektis->slogin . "))";
		}
		$query .= "ORDER BY `login`";

		// Δημιουργούμε λίστα όλων των ενεργών παικτών, ώστε να μπορούμε
		// να μαρκάρουμε τους ενεργούς παίκτες.
		$energos = self::energos_pektis();

		// Δημιουργούμε λίστες φίλων και αποκλεισμένων του παίκτη.
		$sxetizomenos = self::sxetizomenos();

		// Δημιουργούμε λίστα των παικτών που πρόκειται να επιστραφεί.
		// Η λίστα θα "γεμίσει" με δεδομένα αμέσως μετά.
		$sxesi = array();

		// Θα μας χρειαστεί και μια ενδιάμεση λίστα όπου θα μαζέψουμε
		// προσωρινά τους παίκτες που μας ενδιαφέρουν. Κατόπιν διατρέχουμε
		// αυτή τη λίστα 3 φορές με σκοπό να δώσουμε πρώτα τους φίλους,
		// μετά τους ασχέτους, και, τέλος, τους αποκλεισμένους.
		$sxesi1 = array();

		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			if ($online && ($row['idle'] > XRONOS_PEKTIS_IDLE_MAX)) { continue; }
			if ($available && array_key_exists($row['login'], $energos)) { continue; }
			$s = new Sxesi;
			if (array_key_exists($row['login'], $sxetizomenos)) {
				$fb = $sxetizomenos[$row['login']] == 'ΦΙΛΟΣ' ? 'F' : 'B';
			}
			else {
				$fb = '';
			}
			$s->set_from_dbrow($row, $energos, $fb);
			$sxesi1[] = $s;
		}

		$n = count($sxesi1);
		if ($n > 0) {
			for ($i = 0; $i < $n; $i++) {
				if ($sxesi1[$i]->status == 'F') {
					$sxesi[] = $sxesi1[$i];
				}
			}
			// Αν έχει δοθεί name pattern, ή κατάσταση online/available
			// τότε επιλέγω και μη σχετιζόμενους παίκτες.
			if (isset($sinedria->peknpat) || $online) {
				for ($i = 0; $i < $n; $i++) {
					if ($sxesi1[$i]->status == '') {
						$sxesi[] = $sxesi1[$i];
					}
				}
			}
			for ($i = 0; $i < $n; $i++) {
				if ($sxesi1[$i]->status == 'B') {
					$sxesi[] = $sxesi1[$i];
				}
			}
		}

		return $sxesi;
	}
}
?>
