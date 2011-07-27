<?php
class Dedomena {
	public $prosklisi;
	public $sxesi;
	public $permes;
	public $trapezi;
	public $partida;

	public function __construct() {
		$this->partida = NULL;
		$this->prosklisi = array();
		$this->sxesi = array();
		$this->permes = array();
		$this->trapezi = array();
	}

	public function diavase() {
		global $globals;

		if (!$globals->klidoma($globals->pektis->login)) {
			Globals::fatal('cannot lock in order to write data file');
		}

		$fh = self::open_file('r');
		if (!$fh) {
			$globals->xeklidoma($globals->pektis->login);
			return(FALSE);
		}

		while ($line = Globals::get_line($fh)) {
			switch ($line) {
			case '@PARTIDA@':	$this->diavase_partida($fh); break;
			case '@PROSKLISI@':	$this->diavase_prosklisi($fh); break;
			case '@SXESI@':		$this->diavase_sxesi($fh); break;
			case '@PERMES@':	$this->diavase_permes($fh); break;
			case '@TRAPEZI@':	$this->diavase_trapezi($fh); break;
			}
		}

		fclose($fh);
		$globals->xeklidoma($globals->pektis->login);
		return(TRUE);
	}

	private function diavase_partida($fh) {
		if ($line = Globals::get_line($fh)) {
			$this->partida = new Partida();
			if (!$this->partida->set_from_string($line)) {
				$this->partida = NULL;
			}
		}
	}

	private function diavase_prosklisi($fh) {
		while ($line = Globals::get_line($fh)) {
			if ($line === '@END@') { return; }

			$p = new Prosklisi();
			if ($p->set_from_file($line)) {
				$this->prosklisi[] = $p;
			}
			else {
				unset($p);
			}
		}
	}

	private function diavase_sxesi($fh) {
		while ($line = Globals::get_line($fh)) {
			if ($line === '@END@') { return; }

			$s = new Sxesi();
			if ($s->set_from_file($line)) {
				$this->sxesi[] = $s;
			}
			else {
				unset($s);
			}
		}
	}

	private function diavase_permes($fh) {
		while ($line = Globals::get_line($fh)) {
			if ($line === '@END@') { return; }

			$p = new Permes();
			if ($p->set_from_file($line)) {
				$this->permes[] = $p;
			}
			else {
				unset($p);
			}
		}
	}

	private function diavase_trapezi($fh) {
		while ($line = Globals::get_line($fh)) {
			if ($line === '@END@') { return; }
		}
	}

	public function grapse() {
		global $globals;

		if (!$globals->klidoma($globals->pektis->login)) {
			Globals::fatal('cannot lock in order to write data file');
		}

		$fh = self::open_file('w');
		if (!$fh) {
			$globals->xeklidoma($globals->pektis->login);
			Globals::fatal('cannot write data file');
		}

		$this->grapse_partida($fh);
		$this->grapse_prosklisi($fh);
		$this->grapse_sxesi($fh);
		$this->grapse_permes($fh);
		$this->grapse_trapezi($fh);

		fclose($fh);
		$globals->xeklidoma($globals->pektis->login);
	}

	private function grapse_partida($fh) {
		global $globals;
		if (!$globals->is_trapezi()) {
			return;
		}

		Globals::put_line($fh, "@PARTIDA@");
		$globals->trapezi->print_raw_data($fh);
	}

	private function grapse_prosklisi($fh) {
		Globals::put_line($fh, "@PROSKLISI@");
		$n = count($this->prosklisi);
		for ($i = 0; $i < $n; $i++) {
			$this->prosklisi[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	private function grapse_sxesi($fh) {
		Globals::put_line($fh, "@SXESI@");
		$n = count($this->sxesi);
		for ($i = 0; $i < $n; $i++) {
			$this->sxesi[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	private function grapse_permes($fh) {
		Globals::put_line($fh, "@PERMES@");
		$n = count($this->permes);
		for ($i = 0; $i < $n; $i++) {
			$this->permes[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	private function grapse_trapezi($fh) {
		Globals::put_line($fh, "@TRAPEZI@");
		$n = count($this->trapezi);
		for ($i = 0; $i < $n; $i++) {
			$this->trapezi[$i]->print_raw_data($fh);
		}
		Globals::put_line($fh, "@END@");
	}

	private static function open_file($rw) {
		global $globals;

		$fname = '../dedomena/' . $globals->pektis->login;
		$fh = @fopen($fname, $rw);
		return($fh);
	}

	public static function prosklisi_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::prosklisi_all_json_data($curr);
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
			self::prosklisi_all_json_data($curr);
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

	private static function prosklisi_all_json_data($prosklisi) {
		$koma = '';
		$n = count($prosklisi);
		print ",prosklisi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$prosklisi[$i]->json_data();
		}
		print "]";
	}

	public static function sxesi_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::sxesi_all_json_data($curr);
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
			self::sxesi_all_json_data($curr);
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

	private static function sxesi_all_json_data($sxesi) {
		$koma = '';
		$n = count($sxesi);
		print ",sxesi:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$sxesi[$i]->json_data();
		}
		print "]";
	}

	public static function permes_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::permes_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		$nprev = $prev ? count($prev) : 0;
		$ncurr = count($curr);
		$koma = '';
		$apopio = $nprev;

		// Αν δεν έχουμε μηνύματα προηγούμενης ενημέρωσης ή αυτά
		// ήσαν περισσότερα από τα τωρινά, τότε τα στέλνω όλα.
		if ((!$prev) || ($ncurr < $nprev)) {
			$apopio = 0;
		}
		else {
			// Ελέγχω αν έχουν τροποποιηθεί μηνύματα της προηγούμενης
			// ενημέρωσης. Αν αυτό είναι αλήθεια τα στέλνω όλα.
			for ($i = 0; $i < $nprev; $i++) {
				if ($curr[$i] != $prev[$i]) {
					$apopio = 0;
					break;
				}
			}
		}

		// Θα στείλουμε είτε όλα τα μηνύματα, είτε αυτά που είναι νεότερα
		// από το τελευταίο που είχαμε στείλει.

		if ($apopio <= 0) {
			self::permes_all_json_data($curr);
			return;
		}

		$koma = '';
		print ",permesNew:[";
		for ($i = $apopio; $i < $ncurr; $i++) {
			print $koma; $koma = ",";
			$curr[$i]->json_data();
		}
		print "]";
	}

	private static function permes_all_json_data($permes) {
		$koma = '';
		$n = count($permes);
		print ",permes:[";
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ',';
			$permes[$i]->json_data();
		}
		print "]";
	}

	public static function trapezi_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::trapezi_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}
	}

	private static function trapezi_all_json_data($trapezi) {
		print ",trapezi:[";
		$koma = '';
		$n = count($trapezi);
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$trapezi[$i]->json_data();
		}
		print "]";
	}

	public static function partida_json_data($curr, $prev = FALSE) {
		if (($prev !== FALSE) && ($prev == $curr)) {
			return;
		}

		print ",partida:{";
		if (isset($curr)) {
			print "k:" . $curr->kodikos .
				",p1:'" . $curr->pektis1 . "'" .
				",a1:" . $curr->apodoxi1 .
				",p2:'" . $curr->pektis2 . "'" .
				",a2:" . $curr->apodoxi2 .
				",p3:'" . $curr->pektis3 . "'" .
				",a3:" . $curr->apodoxi3 .
				",s:" . $curr->kasa .
				",p:" . $curr->prive .
				",t:" . $curr->pektis .
				",h:" . $curr->thesi;
		}
		print "}";
	}
}

function torina_dedomena() {
	$dedomena = new Dedomena();
	$dedomena->prosklisi = process_prosklisi();
	$dedomena->sxesi = process_sxesi();
	$dedomena->permes = process_permes();
	$dedomena->trapezi = process_trapezi();
	$dedomena->partida = process_partida();
	return($dedomena);
}

function freska_dedomena($dedomena) {
	$dedomena->grapse();
	print_epikefalida();
	print ",f:1}";

	Dedomena::partida_json_data($dedomena->partida);
	Dedomena::prosklisi_json_data($dedomena->prosklisi);
	Dedomena::sxesi_json_data($dedomena->sxesi);
	Dedomena::permes_json_data($dedomena->permes);
	Dedomena::trapezi_json_data($dedomena->trapezi);
}

function diaforetika_dedomena($curr, $prev) {
	$curr->grapse();
	print_epikefalida();
	print "}";

	Dedomena::partida_json_data($curr->partida, $prev->partida);
	Dedomena::prosklisi_json_data($curr->prosklisi, $prev->prosklisi);
	Dedomena::sxesi_json_data($curr->sxesi, $prev->sxesi);
	Dedomena::permes_json_data($curr->permes, $prev->permes);
	Dedomena::trapezi_json_data($curr->trapezi, $prev->trapezi);
}
?>
