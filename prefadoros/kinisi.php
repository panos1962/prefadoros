<?php
class Kinisi {
	public $kodikos;
	public $dianomi;
	public $pektis;
	public $idos;
	public $data;

	public function __construct() {
		unset($this->kodikos);
		unset($this->dianomi);
		unset($this->pektis);
		unset($this->idos);
		unset($this->data);
	}

	public function set_from_dbrow($row) {
		global $globals;

		$this->kodikos = $row['kodikos'];
		$this->dianomi = $row['dianomi'];
		$this->pektis = $row['pektis'];
		$this->idos = $row['idos'];
		$this->data = $row['data'];
		$this->prostasia();
	}

	// Η μέθοδος "prostasia" έχει σκοπό την απόκρυψη των δεδομένων
	// κίνησης. Αυτό είναι κυρίως χρήσιμο στα κλειστά τραπέζια, όπου
	// τα φύλλα της διανομής, αλλά και του τζόγου, έρχονται κλειστά
	// στους θεατές. Πέρα, όμως, από την απόκρυψη δεδομένων από τους
	// θεατές των κλειστών τραπεζιών, αποκρύπτονται και πληροφορίες
	// που αφορούν στα φύλλα του τζόγου και των άλλων παικτών.

	public function prostasia() {
		global $globals;
		if (!$globals->is_trapezi()) { return; }

		switch ($this->idos) {
		case 'ΔΙΑΝΟΜΗ':
			$x = explode(":", $this->data);
			if (count($x) != 4) { return; }

			$plati = $globals->trapezi->is_theatis() ? $globals->pektis->get_plati() : "BV";
			$fila = "";
			for ($i = 0; $i < 10; $i++) { $fila .= $plati; }

			$this->data = $plati . $plati;
			if ($globals->trapezi->is_theatis()) {
				if ($globals->trapezi->klisto) {
					$this->data .= ":" . $fila . ":" . $fila . ":" . $fila;
				}
				else {
					$this->data .= ":" . $x[1] . ":" . $x[2] . ":" . $x[3];
				}
			}
			else {
				$this->data .= ":" . ($globals->trapezi->thesi == 1 ? $x[1] : $fila) .
					":" . ($globals->trapezi->thesi == 2 ? $x[2] : $fila) .
					":" . ($globals->trapezi->thesi == 3 ? $x[3] : $fila);
			}
			break;
		case 'ΤΖΟΓΟΣ':
			$plati = $globals->trapezi->is_theatis() ?
				$globals->pektis->get_plati(TRUE) : "BV";
			if ($globals->trapezi->is_theatis()) {
				if ($globals->trapezi->klisto) {
					$this->data = $plati . $plati;
				}
			}
			elseif ($this->pektis != $globals->trapezi->thesi) {
				$this->data = $plati . $plati;
			}
			break;
		case 'ΑΓΟΡΑ':
			$x = explode(":", $this->data);
			if (count($x) != 2) { return; }

			$plati = $globals->trapezi->is_theatis() ? $globals->pektis->get_plati() : "BV";
			$fila = "";
			for ($i = 0; $i < 10; $i++) { $fila .= $plati; }

			$this->data = $x[0] . ":";
			if ($globals->trapezi->is_theatis()) {
				if ($globals->trapezi->klisto) {
					$this->data .= $fila;
				}
				else {
					$this->data .= $x[1];
				}
			}
			elseif ($this->pektis == $globals->trapezi->thesi) {
				$this->data .= $x[1];
			}
			else {
				$this->data .= $fila;
			}
			break;
		}
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 5) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->dianomi = $cols[$nf++];
		$this->pektis = $cols[$nf++];
		$this->idos = $cols[$nf++];
		$this->data = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->kodikos . "\t" . $this->dianomi .
			"\t" . $this->pektis . "\t" . $this->idos . "\t" . $this->data);
	}

	public function json_data() {
		print "{k:" . $this->kodikos . ",p:" . $this->pektis .
			",i:'" . $this->idos . "',d:'" . $this->data . "'}";
	}

	public static function diavase($fh, &$klist) {
		while ($line = Globals::get_line_end($fh)) {
			$k = new Kinisi;
			if ($k->set_from_file($line)) {
				$klist[] = $k;
			}
		}
	}

	public static function grapse($fh, &$klist) {
		Globals::put_line($fh, "@KINISI@");
		$n = count($klist);
		for ($i = 0; $i < $n; $i++) {
			$klist[$i]->print_raw_data($fh);
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
		// δεδομένα των κινήσεων δεικτοδοτημένα με τους κωδικούς
		// των κινήσεων.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata["k" . $curr[$i]->kodikos] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata["k" . $prev[$i]->kodikos] = &$prev[$i];
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
			self::print_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",kinisiDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",kinisiMod:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",kinisiNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$klist) {
		$koma = '';
		$n = count($klist);
		print ",kinisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$klist[$i]->json_data();
		}
		print "]";
	}

	public static function process() {
		global $globals;

		$kinisi = array();

		if ($globals->is_dianomi()) {
			$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
			$query = "SELECT * FROM `kinisi` WHERE `dianomi` = " .
				$dianomi . " ORDER BY `kodikos`"; 
			$result = $globals->sql_query($query);
			while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$k = new Kinisi;
				$k->set_from_dbrow($row);
				$kinisi[] = $k;
			}
		}

		return $kinisi;
	}

	public static function insert($dianomi, $pektis, $idos, $data) {
		global $globals;

		self::check_data($idos, $data);

		$query = "INSERT INTO `kinisi` (`dianomi`, `pektis`, `idos`, `data`) VALUES (" .
			$dianomi . ", " . $pektis . ", '" . $idos . "', '" . $data . "')";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			die("Απέτυχε η εισαγωγή κίνησης (" . $query . ")");
		}
		return @mysqli_insert_id($globals->db);
	}

	public static function check_data($idos, $data) {
		return;
	}
}
