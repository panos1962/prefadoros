<?php
class Sizitisi {
	public $kodikos;
	public $pektis;
	public $trapezi;
	public $sxolio;
	public $pote;

	public function __construct() {
		unset($this->kodikos);
		unset($this->pektis);
		unset($this->trapezi);
		unset($this->sxolio);
		unset($this->pote);
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->pektis = $row['παίκτης'];
		$this->trapezi = $row['τραπέζι'];
		$this->sxolio = $row['σχόλιο'];
		$this->pote = $row['πότε'];
	}

	public function json_data() {
		print "{k:" . $this->kodikos . ",p:'" . $this->pektis .
			"',t:" . $this->trapezi . ",s:'" . $this->sxolio .
			"',w:" . $this->pote . "}";
	}

	public static function print_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::print_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		if ($prev->sizitisi_last <= 0) {
			self::print_all_json_data($curr);
			return;
		}

		print ",sizitisiNew:[";
		$koma = '';
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$curr->sizitisi[$i]->json_data();
		}
		print "]";
	}

	private static function print_all_json_data(&$slist) {
		$koma = '';
		$n = count($slist);
		print ",sizitisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$slist[$i]->json_data();
		}
		print "]";
	}

	public static function process() {
		global $globals;
		global $sinedria;

		$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

		$query1 = "SELECT `κωδικός`, `παίκτης`, `τραπέζι`, `σχόλιο`, " .
			"(UNIX_TIMESTAMP(`πότε`) AS `πότε` " .
			"FROM `συζήτηση` WHERE `τραπέζι` IS 

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
		$energos = Sizitisi::energos_pektis();

		// Δημιουργούμε λίστα των παικτών που πρόκειται να επιστραφεί.
		// Η λίστα θα "γεμίσει" με δεδομένα αμέσως μετά.
		$sizitisi = array();

		// Πρώτα θα εμφανιστούν οι παίκτες που σχετίζονται ως "φίλοι" με
		// τον παίκτη.
		$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
			"(`παίκτης` LIKE " . $slogin . ") AND " .
			"(`status` LIKE 'ΦΙΛΟΣ')))" . $query2;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			if ((!$online) || ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX)) {
				$s = new Sizitisi;
				$s->set_from_dbrow($row, $energos, 'F');
				$sizitisi[] = $s;
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
					$s = new Sizitisi;
					$s->set_from_dbrow($row, $energos);
					$sizitisi[] = $s;
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
				$s = new Sizitisi;
				$s->set_from_dbrow($row, $energos, 'B');
				$sizitisi[] = $s;
			}
		}

		return $sizitisi;
	}
}
?>
