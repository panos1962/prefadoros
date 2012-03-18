<?php

// Η σταθερά "WRITING_ACTIVE" είναι ο χρόνος που ένα σχόλιο ένδειξης
// γραφής σχολίου ("@WP", ή "@WK@") θεωρείται ενεργό. Ο χρόνος αυτός
// ορίζεται σε δευτερόλεπτα.
define('WRITING_ACTIVE', 20);

// Η σταθερά "KAFENIO_TREXONTA_SXOLIA" δείχνει το πλήθος των σχολίων της
// δημόσιας συζήτησης που επιστρέφονται αρχικά στον παίκτη.
define('KAFENIO_TREXONTA_SXOLIA', 30);

// Η σταθερά "SXOLIA_CLEANUP_FREQ" δείχνει κάθε πότε θα γίνεται
// καθαρισμός σχολίων είτε σε επίπεδο δημόσιας συζήτησης (καφενείο),
// είτε σε επίπεδο τραπεζιού
define('SXOLIA_CLEANUP_FREQ', 50);

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
		$this->kodikos = $row['kodikos'];
		$this->pektis = $row['pektis'];
		$this->sxolio = $row['sxolio'];
		$this->pote = $row['pote'];
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 4) { return(FALSE); }

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
		global $globals;
		$sxolio = preg_replace('/\\\/', '\\\\\\', $this->sxolio);
		$sxolio = preg_replace("/'/", "\'", $sxolio);
		print "{k:" . $this->kodikos . ",p:'" . $this->pektis . "',s:'" .
			$sxolio . "',w:" . ($this->pote - $globals->time_dif) . "}";
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
			print ",kafenioDel:[";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "'";
			}
			print "]";
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

	public static function select_clause() {
		return "SELECT `kodikos`, `trapezi`, `pektis`, `sxolio`, " .
			"UNIX_TIMESTAMP(`pote`) AS `pote` FROM `sizitisi` WHERE ";
	}

	public static function process_sizitisi() {
		global $globals;
		static $sizitisi = NULL;
		static $etrexe_ts = 0.0;
		static $stmnt = NULL;
		$errmsg = "Sizitisi::process_sizitisi(): ";

		$tora_ts = microtime(TRUE);
		if ($tora_ts - $etrexe_ts <= 1.5) {
			return($sizitisi);
		}

		$sizitisi = array();
		if ($globals->not_trapezi()) {
			return($sizitisi);
		}

		self::cleanup_sizitisi($globals->trapezi->kodikos);

		// Μαζεύουμε σχόλια του τραπεζιού και τυχόν σχόλια ένδειξης
		// συγγραφής σχολίων στο καφενείο.
		if (!isset($stmnt)) {
			$query = self:: select_clause() .
				"(`trapezi` = ?) OR ((UNIX_TIMESTAMP(`pote`) > ?) " .
				"AND (`sxolio` = BINARY '@WK@')) ORDER BY `kodikos`";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$writing = time() - WRITING_ACTIVE;
		$stmnt->bind_param("ii", $globals->trapezi->kodikos, $writing);
		$stmnt->execute();
		$row = array();
		$stmnt->bind_result($row['kodikos'], $row['trapezi'], $row['pektis'],
				$row['sxolio'], $row['pote']);
		while ($stmnt->fetch()) {
			if (self::my_notice($row)) {
				continue;
			}
			if (($row['trapezi'] != $globals->trapezi->kodikos) &&
				($row['pektis'] != $globals->trapezi->pektis1) &&
				($row['pektis'] != $globals->trapezi->pektis2) &&
				($row['pektis'] != $globals->trapezi->pektis3)) {
				continue;
			}
			$s = new Sizitisi;
			$s->set_from_dbrow($row);
			$sizitisi[] = $s;
		}

		$etrexe_ts = microtime(TRUE);
		return $sizitisi;
	}

	public static function my_notice($row) {
		global $globals;
		if ($row['pektis'] != $globals->pektis->login) { return(FALSE); }
		switch ($row['sxolio']) {
		case "@WP@":
		case "@WK@":
		case "@KN@":
			return(TRUE);
		}

		return(FALSE);
	}

	private static function cleanup_sizitisi($trapezi = NULL) {
		global $globals;

		if (mt_rand(1, SXOLIA_CLEANUP_FREQ) != 1) {
			return;
		}

		$pio_trapezi = "`trapezi` " . (isset($trapezi) ? "= " . $trapezi : "IS NULL");

		$query = "SELECT `kodikos` FROM `sizitisi` WHERE " . $pio_trapezi .
			" ORDER BY `kodikos` DESC LIMIT " . KAFENIO_TREXONTA_SXOLIA;
		$result = $globals->sql_query($query);
		$count = 0;
		while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
			$proto = $row[0];
			$count++;
		}
		if ($count < KAFENIO_TREXONTA_SXOLIA) {
			return;
		}

		$query = "DELETE FROM `sizitisi` WHERE (" . $pio_trapezi . ") " .
			"AND (`kodikos` < " . $proto . ")";
		$globals->sql_query($query);
	}

	public static function process_kafenio() {
		global $globals;
		global $kafenio_apo;
		static $sizitisi = NULL;
		static $etrexe_ts = 0.0;
		static $stmnt = NULL;
		$errmsg = "Sizitisi::process_kafenio(): ";

		$tora_ts = microtime(TRUE);
		if ($tora_ts - $etrexe_ts <= 1.5) {
			return($sizitisi);
		}

		self::cleanup_sizitisi();

		// Η global μεταβλητή "kafenio_apo" είναι κοινή εδώ και στο βασικό
		// πρόγραμμα ελέγχου εμφάνισης νέων δεδομένων ("prefadoros/neaDedomena.php").
		// Αρχικά η τιμή της είναι ή ασαφής, ή μηδέν. Αυτό σημαίνει ότι πρόκειται
		// για το πρώτο μάζεμα σχολίων της δημόσιας συζήτησης (ΔΣ), οπότε σε αυτήν
		// την περίπτωση θα μαζευτούν τα τρέχοντα σχόλια της ΔΣ και η μεταβλητή
		// "kafenio_apo" θα πάρει τιμή από το πρώτο από αυτά τα σχόλια. Αυτή
		// η τιμή θα χρησιμοποιηθεί μέχρι να λήξει ο τρέχων κύκλος ελέγχου,
		// ενώ για τους επόμενους κύκλους θα μας έρχεται ως παράμετρος από
		// τον client.

		if ((!isset($kafenio_apo)) || ($kafenio_apo < 1)) {
			$kafenio_apo = 1;
			$query = self::select_clause() . "(`trapezi` IS NULL) " .
				"ORDER BY `kodikos` LIMIT " . KAFENIO_TREXONTA_SXOLIA;
			$result = $globals->sql_query($query);
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$kafenio_apo = $row['kodikos'];
				@mysqli_free_result($result);
				break;
			}
		}

		$sizitisi = array();
		if (!isset($stmnt)) {
			$query = self::select_clause() . "(`trapezi` IS NULL) " .
				"AND (`kodikos` >= ?) ORDER BY `kodikos`";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->bind_param("i", $kafenio_apo);
		$stmnt->execute();
		$row = array();
		$stmnt->bind_result($row['kodikos'], $row['trapezi'], $row['pektis'],
				$row['sxolio'], $row['pote']);
		while ($stmnt->fetch()) {
			if (self::my_notice($row)) {
				continue;
			}
			$s = new Sizitisi;
			$s->set_from_dbrow($row);
			$sizitisi[] = $s;
		}

		$etrexe_ts = microtime(TRUE);
		return($sizitisi);
	}

	// Η function "καθαρίζει" τα πρόσφατα writing σχόλια του παίκτη και καλείται
	// κατά την αποστολή σχολίων από τον παίκτη.

	public static function cleanup_writing() {
		global $globals;
		if ($globals->not_pektis()) { return 0; }

		$query = "DELETE FROM `sizitisi` " .
			"WHERE (`pektis` = BINARY " . $globals->pektis->slogin . ") " .
			"AND (`sxolio` IN ('@WP@', '@WK@'))";
		$globals->sql_query($query);
		return (@mysqli_affected_rows($globals->db));
	}

	// Η μέθοδος "set_dirty" θέτει το πεδίο "sizitisidirty" σε 2 για όλες
	// τις συνεδρίες που δεν το έχουν 2. Για λόγους που αφορούν στο μολύβι
	// δίνεται η δυνατότητα να ενημερώσουμε μόνο τις συνεδρίες των άλλων παικτών
	// περνώντας μια false τιμή.

	public static function set_dirty($ola = TRUE, $trapezi = NULL) {
		global $globals;

		$query = "UPDATE `sinedria` SET `sizitisidirty` = 2";

	/*
		if (!$ola) {
			$query .= " AND (`pektis` != BINARY " . $globals->pektis->slogin . ")";
		}
	*/

		if (isset($trapezi)) {
			$query .= " WHERE `trapezi` = " . ($trapezi == "NULL" ? 0 : $trapezi);
		}

		@mysqli_query($globals->db, $query);
	}
}
?>
