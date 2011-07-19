<?php
class Dedomena {
	public $sxesi;
	public $trapezi;

	public function __construct() {
		$this->sxesi = array();
		$this->permes = array();
		$this->trapezi = array();
	}

	public function diavase() {
		$fh = self::open_file('r');
		if (!$fh) {
			return(FALSE);
		}

		while ($line = Globals::get_line($fh)) {
			switch ($line) {
			case '@SXESI@':
				$this->diavase_sxesi($fh);
				break;
			case '@PERMES@':
				$this->diavase_permes($fh);
				break;
			case '@TRAPEZIA@':
				$this->diavase_trapezi($fh);
				break;
			}
		}
		fclose($fh);
		return(TRUE);
	}

	private function diavase_sxesi($fh) {
		while ($line = Globals::get_line($fh)) {
			if ($line === '@END@') {
				return;
			}

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
			if ($line === '@END@') {
				return;
			}

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
			if ($line === '@END@') {
				return;
			}
		}
	}

	public function grapse() {
		$fh = self::open_file('w');
		if (!$fh) {
			Globals::fatal('cannot write data file');
		}

		$this->grapse_sxesi($fh);
		$this->grapse_permes($fh);
		$this->grapse_trapezi($fh);
		fclose($fh);
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

	public function json_data() {
		$this->sxesi_json_data();
		$this->permes_json_data();
		$this->trapezi_json_data();
	}

	public function sxesi_json_data() {
		print ",sxesi:[";
		$n = count($this->sxesi);
		for ($i = 0; $i < $n; $i++) {
			if ($i > 0) {
				print ",";
			}
			$this->sxesi[$i]->json_data();
		}
		print "]";
	}

	public function permes_json_data($prev = FALSE) {
		if (!$prev) {
			$nprev = 0;
		}
		else {
			$nprev = count($prev);
		}
		$ncurr = count($this->permes);
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
				if ($this->permes[$i] != $prev[$i]) {
					$apopio = 0;
					break;
				}
			}
		}

		print ",permes";
		if ($apopio > 0) {
			print "New";
		}
		print ":[";
		for ($i = $apopio; $i < $ncurr; $i++) {
			print $koma;
			$koma = ',';
			$this->permes[$i]->json_data();
		}
		print "]";
	}

	public function trapezi_json_data() {
		print ",trapezi:[";
		$n = count($this->trapezi);
		for ($i = 0; $i < $n; $i++) {
			if ($i > 0) {
				print ",";
			}
			$this->trapezi[$i]->json_data();
		}
		print "]";
	}
}

function torina_dedomena() {
	$dedomena = new Dedomena();
	$dedomena->sxesi = process_sxesi();
	$dedomena->permes = process_permes();
	$dedomena->trapezi = process_trapezi();
	return($dedomena);
}

function freska_dedomena($dedomena) {
	$dedomena->grapse();
	print_epikefalida();
	print ",freska:true}";
	$dedomena->json_data();
}

function diaforetika_dedomena($curr, $prev) {
	$curr->grapse();
	print_epikefalida();
	print "}";

	if ($curr->sxesi == $prev->sxesi) {
		print ",sxesi:'same'";
	}
	else {
		$curr->sxesi_json_data();
	}

	if ($curr->permes == $prev->permes) {
		print ",permes:'same'";
	}
	else {
		$curr->permes_json_data($prev->permes);
	}

	if ($curr->trapezi == $prev->trapezi) {
		print ",trapezi:'same'";
	}
	else {
		$curr->trapezi_json_data();
	}
}
?>
