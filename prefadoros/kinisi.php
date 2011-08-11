<?php
class Kinisi {
	public $kodikos;
	public $dianomi;
	public $pekis;
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
		$this->kodikos = $row['κωδικός'];
		$this->dianomi = $row['διανομή'];
		$this->pektis = $row['παίκτης'];
		$this->idos = $row['είδος'];
		$this->data = $row['data'];
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

	public function json_data($thesi_map) {
		if ($thesi_map === FALSE) {
			die("kinisi::json_data: ασαφής αντιστοίχιση θέσεων");
		}

		print "{k:" . $this->kodikos . ",p:" . $thesi_map[$this->pektis] .
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

	public static function print_json_data($curr, $thesi_map = FALSE, $prev = FALSE) {
		if ($prev === FALSE) {
			self::print_all_json_data($curr, $thesi_map);
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
			self::print_all_json_data($curr, $thesi_map);
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
				$mod[$i]->json_data($thesi_map);
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",kinisiNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data($thesi_map);
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$klist, $thesi_map) {
		$koma = '';
		$n = count($klist);
		print ",kinisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$klist[$i]->json_data($thesi_map);
		}
		print "]";
	}

	public static function process() {
		global $globals;

		$kinisi = array();

		if ($globals->is_dianomi()) {
			$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
			$query = "SELECT * FROM `κίνηση` WHERE `διανομή` = " .
				$dianomi . " ORDER BY `κωδικός`"; 
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

		$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) VALUES (" .
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
