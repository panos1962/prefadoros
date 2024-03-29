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

	// Πρόκειται για διορθωτική function η οποία έχει σκοπό να μην
	// επιτρέψει ταυτόχρονη αποστολή μπάζας μαζί με την αμέσως επόμενη
	// κίνηση (επόμενο φύλλο, πληρωμή κλπ). Ελέγχεται το array των
	// τρεχουσών κινήσεων σε σχέση με το array κινήσεων της αμέσως
	// προηγούμενης αποστολής, ώστε αν το array των τρεχουσών κινήσεων
	// καταλήγει με κίνηση τύπου ΜΠΑΖΑ συνοδευόμενη από κάποια επόμενη
	// κίνηση να περικόπτεται αυτή η επόμενη κίνηση, εφόσον το array
	// των κινήσεων της προηγούμενης αποστολής δεν κατέληγε στην κίνηση
	// της μπάζας αυτής. Η κίνηση που περικόπτεται θα επιστραφεί, προφανώς
	// στην αμέσως επόμενη αποστολή.

	public static function fix_baza_filo($curr, $prev) {
		if ($curr == $prev) { return $curr; }
		if (($ncurr = count($curr)) < 2) { return $curr; }

		switch ($curr[$ncurr - 2]->idos) {
		case 'ΜΠΑΖΑ':
		case 'ΦΥΛΛΟ':
			break;
		default:
			return $curr;
		}

		// Το array κινήσεων της προηγούμενης αποστολής πρέπει να
		// περιέχει ακριβώς μια λιγότερη κίνηση και να καταλήγει
		// σε κίνηση ιδίου τύπου με την προτελευταία κίνηση
		// της τρέχουσας αποστολής.
		$nprev = count($prev);
		if (($nprev == ($ncurr - 1)) &&
			($prev[$nprev - 1]->idos == $curr[$ncurr - 2]->idos)) {
			return $curr;
		}

		// Πρέπει να περικοπεί η τελευταία κίνηση, ώστε η κίνηση του
		// επίμαχου τύπου να αποσταλεί χωρίς επόμενη κίνηση, για να γίνει
		// κανονικά η εμφάνιση, ή το κλείσιμο της μπάζας στην οθόνη του client.
		return array_slice($curr, 0, $ncurr - 1, TRUE);
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
			print ",kd:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",km:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",kn:[";
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
		print ",k:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$klist[$i]->json_data();
		}
		print "]";
	}

	// Ακολουθεί η πολύ σημαντική μέθοδος "process" η οποία διαβάζει όλες τις
	// κινήσεις της τρέχουσας διανομής και επιστρέφει array κινήσεων. Η μέθοδος
	// κάνει και διορθώσεις προκειμένου να μην περάσουν στα επιστρεφόμενα
	// δεδομένα παράδοξα πράγματα, π.χ. διπλοπαιξιές, μισοτελειωμένες μπάζες κλπ,
	// δηλαδή να μην επιστραφούν λανθασμένες κινήσεις.
	//
	// ΣΗΜΑΝΤΙΚΟ
	// =========
	// ΟΙ ΔΙΟΡΘΩΣΕΙΣ ΠΡΕΠΕΙ ΝΑ ΓΙΝΟΝΤΑΙ ΑΠΟ ΟΛΟΥΣ ΤΟΥΣ ΠΑΙΚΤΕΣ, ΔΕΝ ΑΡΚΕΙ, Π.Χ.
	// ΝΑ ΤΙΣ ΚΑΝΕΙ Ο ΠΡΩΤΟΣ ΠΑΙΚΤΗΣ, ΚΑΘΩΣ ΑΛΛΕΣ ΑΥΤΟΜΑΤΕΣ ΚΙΝΗΣΕΙΣ ΚΑΝΕΙ Ο DEALER,
	// ΑΛΛΕΣ Ο ΤΖΟΓΑΔΟΡΟΣ ΚΛΠ.

	public static function process() {
		global $globals;
		static $stmnt = NULL;
		$errmsg = "Kinisi::process(): ";

		$kinisi = array();
		if ($globals->not_dianomi()) {
			return($kinisi);
		}

		if ($stmnt == NULL) {
			$query = "SELECT `kodikos`, `pektis`, `idos`, `data` " .
				"FROM `kinisi` WHERE `dianomi` = ? ORDER BY `kodikos`";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
		$stmnt->bind_param("i", $dianomi);
		$stmnt->execute();
		$stmnt->bind_result($kodikos, $pektis, $idos, $data);
		while ($stmnt->fetch()) {
			$k = new Kinisi;
			$k->kodikos = $kodikos;
			$k->dianomi = $dianomi;
			$k->pektis = $pektis;
			$k->idos = $idos;
			$k->data = $data;
			$k->prostasia();
			$kinisi[] = $k;
		}

		// Έλεγχος και τυχόν διορθώσεις γίνονται από τους παίκτες,
		// δεν υπάρχει λόγος να γίνονται και από τους θεατές.
		if ($globals->trapezi->is_theatis()) {
			return($kinisi);
		}

		// Αν η πρώτη κίνηση της διανομής δεν είναι τύπου "ΔΙΑΝΟΜΗ"
		// τότε διαγράφεται η παρούσα διανομή.
		$cnt = count($kinisi);
		if (($cnt > 0) && ($kinisi[0]->idos != "ΔΙΑΝΟΜΗ")) {
			return(self::apokopi($dianomi, $kinisi));
		}

		// Θέτουμε τον δείκτη τελευταίας ορθής κίνησης στην πρώτη
		// κίνηση που μόλις διαπιστώσαμε ότι είναι τύπου "ΔΙΑΝΟΜΗ".
		$lastok = 0;

		// Κάνουμε έναν έλεγχο για τυχόν διπλά φύλλα από τον ίδιο παίκτη
		// στην ίδια μπάζα και άλλες πιθανές λανθασμένες κινήσεις. Αν βρεθεί
		// λανθασμένη κίνηση, διαγράφουμε τις κινήσεις από εκεί και μετά
		// και επιστρέφουμε το μέχρι εκεί array των κινήσεων της διανομής.

		$baza_count = 0;	// πόσες μπάζες έγιναν μέχρι στιγμής
		$baza_pire = 0;		// ποιος παίκτης πήρε την τελευταία μπάζα
		$evale_filo = array();	// array δεικτοδοτημένο με τους παίκτες
		$filo = array();	// array δεικτοδοτημένο με τα φύλλα
		$claim = 0;		// κινήσεις τύπου "CLAIM"
		$pektes = 2;		// παίκτες που συμμετέχουν (αναπροσαρμόζεται στην πορεία)

		for ($i = 1; $i < $cnt; $i++) {
			// Αν ανιχνεύσουμε δεύτερη κίνηση τύπου "ΔΙΑΝΟΜΗ",
			// τότε είναι λάθος.
			if ($kinisi[$i]->idos == "ΔΙΑΝΟΜΗ") {
				return(self::apokopi($dianomi, $kinisi, $lastok));
			}

			if ($kinisi[$i]->idos == "CLAIM") {
				$claim++;
				continue;
			}

			if ($kinisi[$i]->idos == "ΜΠΑΖΑ") {
				$baza_count++;

				// Περισσότερες από δέκα μπάζες είναι λάθος.
				if ($baza_count > 10) {
					return(self::apokopi($dianomi, $kinisi, $lastok));
				}

				// Λιγότερα από 2 ή 3 φύλλα στην μπάζα είναι λάθος.
				if (count($evale_filo) < $pektes) {
					return(self::apokopi($dianomi, $kinisi, $lastok));
				}

				// Κρατάμε τα στοιχεία αυτής της μπάζας και καθαρίζουμε
				// το array των παικτών που έβαλαν φύλλο στην μπάζα.
				// Επίσης, θεωρούμε πια ότι μέχρι και εδώ είμαστε καλά.
				$baza_pire = $kinisi[$i]->pektis;

				// Βλέπουμε πόσοι συμμετείχαν στην μπάζα και αλλάζουμε
				// το πλήθος των παικτών κάθε μπάζας (προς τα πάνω),
				// καθώς το πρόβλημα εμφανίζεται στις τελευταίες μπάζες.
				$np = count($evale_filo);
				if ($np > $pektes) {
					$pektes = $np;
				}

				$evale_filo = array();
				$lastok = $i;
				continue;
			}

			// Αν συναντήσουμε κίνηση τύπου "ΠΛΗΡΩΜΗ" σημαίνει ότι
			// η διανομή έχει παιχτεί και γίνεται πληρωμή.
			if ($kinisi[$i]->idos == "ΠΛΗΡΩΜΗ") {
				// Αν έχω ήδη συναντήσει τουλάχιστον δύο κινήσεις
				// τύπου "CLAIM" θεωρώ σωστή την πληρωμή.
				if ($claim > 1) {
					return(self::apokopi($dianomi, $kinisi, $i));
				}

				// Δεν μπορεί να υπάρχει μόνο μια κίνηση τύπου "CLAIM"
				// και να έχουμε προχωρήσει στην πληρωμή.
				if ($claim == 1) {
					self::apopliromi($dianomi);
					return(self::apokopi($dianomi, $kinisi, $lastok));
				}

				// Δεν είχαμε claim, οπότε εάν δεν έχω μπάζες σημαίνει
				// ότι δεν είχαμε συμμετοχές, επομένως η πληρωμή θεωρείται
				// σωστή.
				if ($baza_count < 1) {
					return(self::apokopi($dianomi, $kinisi, $i));
				}

				// Αν έχω έστω και μια μπάζα, θα πρέπει οι μπάζες να
				// είναι δέκα ώστε να μπορεί να γίνει πληρωμή.
				if ($baza_count != 10) {
					self::apopliromi($dianomi);
					return(self::apokopi($dianomi, $kinisi, $lastok));
				}

				// Όλα εντάξει, πληρωμή δεκτή.
				return(self::apokopi($dianomi, $kinisi, $i));
			}

			// Από εδώ και μετά ελέγχονται πλέον μόνο οι κινήσεις
			// τύπου "ΦΥΛΛΟ".
			if ($kinisi[$i]->idos != "ΦΥΛΛΟ") {
				continue;
			}

			// Ελέγχουμε για τυχόν δεύτερο παίξιμο του ίδιου φύλλου.
			if (array_key_exists($kinisi[$i]->data, $filo)) {
				return(self::apokopi($dianomi, $kinisi, $i - 1));
			}

			// Ελέγχουμε μήπως παίζει ο ίδιος παίκτης δεύτερη φορά.
			if (array_key_exists($kinisi[$i]->pektis, $evale_filo)) {
				return(self::apokopi($dianomi, $kinisi, $i - 1));
			}

			// Ελέγχουμε αν ο παίκτης που βάζει το φύλλο είναι
			// ο σωστός παίκτης.
			if (($baza_pire > 0) && (count($evale_filo) <= 0) &&
				($kinisi[$i]->pektis != $baza_pire)) {
				return(self::apokopi($dianomi, $kinisi, $i - 1));
			}

			// Κρατάμε το φύλλο που παίχτηκε και τον παίκτη
			// που έπαιξε τελευταίος.
			$filo[$kinisi[$i]->data] = TRUE;
			$evale_filo[$kinisi[$i]->pektis] = TRUE;
		}

		return($kinisi);
	}

	// Η μέθοδος "apokopi" χρησιμοποιείται σε περίπτωση ανίχνευσης
	// λανθασμένης κίνησης, οπότε διαγράφονται οι κινήσεις μετά την
	// τελευταία ορθή και επιστρέφεται το ορθό μέρος του array κινήσεων.

	private static function apokopi($dianomi, $kinisi, $ok = -1) {
		global $globals;

		// Σε περίπτωση που δεν καμία υπάρχει ορθή κίνηση στην παρούσα
		// διανομή, διαγράφεται εξ ολοκλήρου η διανομή και επιστρέφεται
		// κενό array κινήσεων, οπότε θα γίνει νέα διανομή.

		if ($ok < 0) {
			$query = "DELETE FROM `dianomi` WHERE `kodikos` = " . $dianomi;
			@mysqli_query($globals->db, $query);
			$kinisi = array();
			return($kinisi);
		}

		$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
			") AND (`kodikos` > " . $kinisi[$ok]->kodikos . ")";
		@mysqli_query($globals->db, $query);
		return(array_slice($kinisi, 0, $ok + 1));
	}

	// Η μέθοδος "apopliromi" χρησιμοποιείται σε περίπτωση διαγραφής
	// λανθασμένης κίνησης τύπου "ΠΛΗΡΩΜΗ". Πράγματι, σε αυτή την
	// περίπτωση έχουν γίνει και οι σχετικές ενημερώσεις της ίδιας
	// της διανομής και του υπολοίπου του τραπεζιού, οπότε θα πρέπει
	// αυτές οι αλλαγές να αναιρεθούν. Μπορεί, ακόμη, στη χειρότερη
	// περίπτωση, να έχει γίνει και νέα διανομή η οποία θα πρέπει
	// να διαγραφεί.

	private static function apopliromi($dianomi) {
		global $globals;

		// Η μέθοδος "pliromi" εφόσον καλείται χωρίς άλλες παραμέτρους
		// μηδενίζει όλα τα ποσά της διανομής.
		Dianomi::pliromi($dianomi);

		// Πιθανόν να έχει ήδη γίνει και η επόμενη διανομή, επομένως
		// διαγράφω τυχόν μεταγενέστερες διανομές για αυτό το τραπέζι.
		$query = "DELETE FROM `dianomi` WHERE (`kodikos` > " . $dianomi .
			") AND (`trapezi` = " . $globals->trapezi->kodikos . ")";
		@mysqli_query($globals->db, $query);

		// Επιχειρούμε και ενημέρωση του υπολοίπου του τραπεζιού.
		$globals->trapezi->update_pistosi();
	}

	public static function insert($dianomi, $pektis, $idos, $data) {
		global $globals;

		self::check_data($idos, $data);

		$query = "INSERT INTO `kinisi` (`dianomi`, `pektis`, `idos`, `data`) VALUES (" .
			$dianomi . ", " . $pektis . ", '" . $idos . "', '" . $data . "')";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			$globals->klise_fige("Απέτυχε η εισαγωγή κίνησης (" . $query . ")");
		}
		return @mysqli_insert_id($globals->db);
	}

	public static function check_data($idos, $data) {
		return;
	}
}
?>
