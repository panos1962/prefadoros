<?php
class Sizitisi {
	public $kodikos;
	public $pektis;
	public $sxolio;
	public $pote;

	public function __construct() {
		$this->kodikos = 0;
		$this->pektis = '';
		$this->sxolio = '';
		$this->pote = 0;
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->pektis = $row['παίκτης'];
		$this->sxolio = $row['σχόλιο'];
		$this->pote = $row['πότε'];
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 4) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pektis = $cols[$nf++];
		$this->sxolio = $cols[$nf++];
		$this->pote = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->kodikos . "\t" . $this->pektis .
			"\t" . $this->sxolio . "\t" . $this->pote);
	}

	public function json_data() {
		$sxolio = preg_replace('/\\\/', '\\\\\\', $this->sxolio);
		$sxolio = preg_replace("/'/", "\'", $sxolio);
		print "{k:" . $this->kodikos . ",p:'" . $this->pektis . "',s:'" .
			$sxolio . "',w:" . $this->pote . "}";
	}

	public static function diavase($fh, &$slist) {
		while ($line = Globals::get_line_end($fh)) {
			$s = new Sizitisi();
			if ($s->set_from_file($line)) {
				$slist[] = $s;
			}
		}
	}

	// Η παράμετρος "sk" είναι "SIZITISI", ή "KAFENIO" ανάλογα
	// με το αν πρόκειται για τη συζήτηση του τραπεζιού, ή του καφενείου.

	public static function grapse($fh, &$slist, $sk) {
		Globals::put_line($fh, "@" . $sk . "@");
		$n = count($slist);
		for ($i = 0; $i < $n; $i++) {
			$slist[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	public static function sizitisi_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::sizitisi_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		// Κατασκευάζω τα arrays "cdata" και "pdata" που περιέχουν τα
		// σχόλια δεικτοδοτημένα με τον κωδικό τους.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata["_" . $curr[$i]->kodikos] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata["_" . $prev[$i]->kodikos] = &$prev[$i];
		}

		// Διατρέχω τώρα παλαιά και νέα δεδομένα με σκοπό να ελέγξω
		// τις διαφορές και να τις καταχωρήσω στα arrays "new", "mod"
		// και "del".

		$ndif = 0;
		$new = array();
		$mod = array();
		foreach($cdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $pdata)) {
				$new[] = &$cdata[$kodikos];
				$ndif++;
			}
			elseif ($cdata[$kodikos] != $pdata[$kodikos]) {
				$mod[$kodikos] = &$cdata[$kodikos];
				$ndif++;
			}
		}

		$del = array();
		foreach($pdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $cdata)) {
				$del[$kodikos] = TRUE;
				$ndif++;
			}
		}

		// Αν οι διαφορές που προέκυψαν μεταξύ παλαιών και νέων δεδομένων
		// είναι περισσότερες από τα ίδια τα δεδομένα, τότε επιστρέφω όλα
		// τα δεδομένα.

		if ($ndif >= $ncurr) {
			self::sizitisi_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",sizitisiDel:[";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "'";
			}
			print "]";
		}

		if (($n = count($mod)) > 0) {
			print ",sizitisiMod:[";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				$mod[$i]->json_data();
			}
			print "]";
		}

		if (($n = count($new)) > 0) {
			print ",sizitisiNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function sizitisi_all_json_data(&$slist) {
		$koma = '';
		$n = count($slist);
		print ",sizitisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$slist[$i]->json_data();
		}
		print "]";
	}

	public static function kafenio_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::kafenio_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		// Κατασκευάζω τα arrays "cdata" και "pdata" που περιέχουν τα
		// σχόλια δεικτοδοτημένα με τον κωδικό τους.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata["_" . $curr[$i]->kodikos] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata["_" . $prev[$i]->kodikos] = &$prev[$i];
		}

		// Διατρέχω τώρα παλαιά και νέα δεδομένα με σκοπό να ελέγξω
		// τις διαφορές και να τις καταχωρήσω στα arrays "new", "mod"
		// και "del".

		$ndif = 0;
		$new = array();
		$mod = array();
		foreach($cdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $pdata)) {
				$new[] = &$cdata[$kodikos];
				$ndif++;
			}
			elseif ($cdata[$kodikos] != $pdata[$kodikos]) {
				$mod[$kodikos] = &$cdata[$kodikos];
				$ndif++;
			}
		}

		$del = array();
		foreach($pdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $cdata)) {
				$del[$kodikos] = TRUE;
				$ndif++;
			}
		}

		// Αν οι διαφορές που προέκυψαν μεταξύ παλαιών και νέων δεδομένων
		// είναι περισσότερες από τα ίδια τα δεδομένα, τότε επιστρέφω όλα
		// τα δεδομένα.

		if ($ndif >= $ncurr) {
			self::kafenio_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",kafenioDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",kafenioMod:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",kafenioNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function kafenio_all_json_data(&$slist) {
		$koma = '';
		$n = count($slist);
		print ",kafenio:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$slist[$i]->json_data();
		}
		print "]";
	}

	public static function process_sizitisi() {
		global $globals;

		$sizitisi = array();
		if ($globals->is_trapezi()) {
			$query = "SELECT `κωδικός`, `παίκτης`, `σχόλιο`, " .
				"UNIX_TIMESTAMP(`πότε`) AS `πότε` FROM `συζήτηση` " .
				"WHERE `τραπέζι` = " . $globals->trapezi->kodikos .
				" ORDER BY `κωδικός`";
			$result = $globals->sql_query($query);
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$s = new Sizitisi;
				$s->set_from_dbrow($row);
				$sizitisi[] = $s;
			}
		}

		return $sizitisi;
	}

	public static function process_kafenio() {
		global $globals;
		global $kafenio_apo;

		if ((!isset($kafenio_apo)) || ($kafenio_apo < 1)) {
			$kafenio_apo = 1;
			$query = "SELECT `κωδικός`, `παίκτης`, `σχόλιο`, " .
				"UNIX_TIMESTAMP(`πότε`) AS `πότε` FROM `συζήτηση` " .
				"WHERE `τραπέζι` IS NULL ORDER BY `κωδικός` DESC LIMIT " .
				KAFENIO_LINES;
			$result = $globals->sql_query($query);
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$kafenio_apo = $row['κωδικός'];
			}
		}

		$sizitisi = array();
		$query = "SELECT `κωδικός`, `παίκτης`, `σχόλιο`, " .
			"UNIX_TIMESTAMP(`πότε`) AS `πότε` FROM `συζήτηση` " .
			"WHERE (`τραπέζι` IS NULL) AND (`κωδικός` >= " .
			$kafenio_apo . ") ORDER BY `κωδικός`";
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$s = new Sizitisi;
			$s->set_from_dbrow($row);
			$sizitisi[] = $s;
		}

		return $sizitisi;
	}
}
?>
