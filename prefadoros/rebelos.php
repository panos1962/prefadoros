<?php
class Rebelos {
	public $login;
	public $theatis;
	public $apasxolimenos;

	public function __construct($login = FALSE, $trapezi = 0) {
		if ($login === FALSE) {
			unset($this->login);
			unset($this->theatis);
			unset($this->apasxolimenos);
		}
		else {
			$this->login = $login;
			$this->theatis = $trapezi;
			$this->apasxolimenos = (Prefadoros::apasxolimenos($login) ? 1 : 0);
		}
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 3) {
			return(FALSE);
		}

		$nf = 0;
		$this->login = $cols[$nf++];
		$this->theatis = $cols[$nf++];
		$this->apasxolimenos = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->login . "\t" .
			$this->theatis . "\t" . $this->apasxolimenos);
	}

	public static function diavase($fh, &$rlist) {
		while ($line = Globals::get_line_end($fh)) {
			$r = new Rebelos();
			if ($r->set_from_file($line)) {
				$rlist[] = $r;
			}
		}
	}

	public static function grapse($fh, &$rlist) {
		Globals::put_line($fh, "@REBELOS@");
		$n = count($rlist);
		for ($i = 0; $i < $n; $i++) {
			$rlist[$i]->print_raw_data($fh, FALSE);
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
			print ",rebelosDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",rebelosMod:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",rebelosNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$rlist) {
		print ",rebelos:[";
		$koma = '';
		$n = count($rlist);
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$rlist[$i]->json_data();
		}
		print "]";
	}

	private function json_data() {
		print "{l:'" . $this->login . "'";
		if ($this->theatis != 0) {
			print ",t:" . $this->theatis;
		}
		if ($this->apasxolimenos != 0) {
			print ",b:1";
		}
		print "}";
	}

	public static function process() {
		global $globals;

		// Δημιουργείται το array "energos" που περιέχει όλους
		// τους online παίκτες, δεικτοδοτημένο με τα login names
		// και τιμή TRUE.

		$energos = Prefadoros::energos_pektis();

		// Θα δημιουργήσουμε array "theatis" με όλους τους θεατές
		// σε ενεργά τραπέζια, δεικτοδοτημένο με τα login names
		// και τιμή τον κωδικό του θεώμενου τραπεζιού και τη θέση.

		$theatis = Prefadoros::lista_theaton();

		// Θα θέσω τιμή FALSE σε όσους παίκτες του array "energos" συμμετέχουν
		// ως παίκτες σε ενεργά τραπέζια.

		$pezon = Prefadoros::pezon_pektis();
		foreach ($pezon as $ppk => $ppv) {
			if (array_key_exists($ppk, $energos)) {
				$energos[$ppk] = FALSE;
			}
		}

		// Στο array "energos" έχω τώρα όλους τους online παίκτες με
		// τιμές TRUE για αυτούς που δεν συμμετέχουν ως παίκτες σε
		// κάποιο τραπέζι (ρέμπελοι) και FALSE για όσους παίζουν.
		// Θα δημιουργήσω το array "rebelos" με όλους τους online
		// παίκτες που είτε είναι πραγματικά ρέμπελοι, είτε συμμετέχουν
		// ως παίκτες σε κάποιο ενεργό τραπέζι, αλλά είναι και θεατές
		// σε άλλο ενεργό τραπέζι.

		$rebelos = array();

		foreach ($energos as $login => $reb) {
			if (array_key_exists($login, $theatis)) {
				$rebelos[] = new Rebelos($login, $theatis[$login]->trapezi);
			}
			elseif ($reb) {
				$rebelos[] = new Rebelos($login, 0);
			}
		}

		return($rebelos);
	}
}
?>
