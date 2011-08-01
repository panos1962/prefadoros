<?php
class Prosklisi {
	public $kodikos;
	public $pios;
	public $pion;
	public $trapezi;
	public $pote;

	public function __construct() {
		unset($this->kofikos);
		unset($this->pios);
		unset($this->pion);
		unset($this->trapezi);
		unset($this->pote);
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->pios = $row['ποιος'];
		$this->pion = $row['ποιον'];
		$this->trapezi = $row['τραπέζι'];
		$this->pote = $row['πότε'];
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 5) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pios = $cols[$nf++];
		$this->pion = $cols[$nf++];
		$this->trapezi = $cols[$nf++];
		$this->pote = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->kodikos . "\t" . $this->pios . "\t" .
			$this->pion . "\t" . $this->trapezi . "\t" . $this->pote);
	}

	public function json_data() {
		print "{k:" . $this->kodikos . ",a:'" . $this->pios .
			"',p:'" . $this->pion . "',t:" . $this->trapezi .
			",s:" . $this->pote . "}";
	}

	public static function diavase($fh, &$plist) {
		while ($line = Globals::get_line_end($fh)) {
			$p = new Prosklisi();
			if ($p->set_from_file($line)) {
				$plist[] = $p;
			}
		}
	}

	public static function grapse($fh, &$plist) {
		Globals::put_line($fh, "@PROSKLISI@");
		$n = count($plist);
		for ($i = 0; $i < $n; $i++) {
			$plist[$i]->print_raw_data($fh);
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
		// δεδομένα των προσκλήσεων δεικτοδοτημένα με τους κωδικούς
		// των προσκλήσεων.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata["p" . $curr[$i]->kodikos] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata["p" . $prev[$i]->kodikos] = &$prev[$i];
		}

		// Διατρέχω τώρα παλαιά και νέα δεδομένα με σκοπό να ελέγξω
		// τις διαφορές και να τις καταχωρήσω στα arrays "new", "mod"
		// και "del".

		$ndif = 0;
		$new = array();
		foreach($cdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $pdata)) {
				$new[] = &$cdata[$kodikos];
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
			self::print_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",prosklisiDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",prosklisiNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$plist) {
		$koma = '';
		$n = count($plist);
		print ",prosklisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$plist[$i]->json_data();
		}
		print "]";
	}

	public static function process() {
		global $globals;

		$prosklisi = array();

		$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";
		$query = "SELECT `κωδικός`, `ποιος`, `ποιον`, `τραπέζι`, " .
			"UNIX_TIMESTAMP(`πότε`) AS `πότε` FROM `πρόσκληση` " .
			"WHERE (`ποιος` LIKE " . $slogin . ") OR " .
			"(`ποιον` LIKE " . $slogin . ") ORDER BY `κωδικός` DESC"; 
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$p = new Prosklisi;
			$p->set_from_dbrow($row);
			$prosklisi[] = $p;
		}

		return $prosklisi;
	}
}
?>
