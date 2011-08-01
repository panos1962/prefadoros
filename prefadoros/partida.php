<?php
class Partida {
	public $kodikos;
	public $pektis1;
	public $apodoxi1;
	public $online1;
	public $pektis2;
	public $apodoxi2;
	public $online2;
	public $pektis3;
	public $apodoxi3;
	public $online3;
	public $kasa;
	public $prive;
	public $theatis;
	public $thesi;

	public function __construct() {
		unset($this->kodikos);
		unset($this->pektis1);
		unset($this->apodoxi1);
		unset($this->online1);
		unset($this->pektis2);
		unset($this->apodoxi2);
		unset($this->online2);
		unset($this->pektis3);
		unset($this->apodoxi3);
		unset($this->online3);
		unset($this->kasa);
		unset($this->prive);
		unset($this->theatis);
		unset($this->thesi);
	}

	public function set_from_string($data) {
		$cols = explode("\t", $data);
		if (count($cols) != 14) {
			return(FALSE);
		}
			
		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pektis1 = $cols[$nf++];
		$this->apodoxi1 = $cols[$nf++];
		$this->online1 = $cols[$nf++];
		$this->pektis2 = $cols[$nf++];
		$this->apodoxi2 = $cols[$nf++];
		$this->online2 = $cols[$nf++];
		$this->pektis3 = $cols[$nf++];
		$this->apodoxi3 = $cols[$nf++];
		$this->online3 = $cols[$nf++];
		$this->kasa = $cols[$nf++];
		$this->prive = $cols[$nf++];
		$this->theatis = $cols[$nf++];
		$this->thesi = $cols[$nf++];
		return(TRUE);
	}

	public static function diavase($fh, &$partida) {
		if ($line = Globals::get_line($fh)) {
			$partida = new Partida();
			if (!$partida->set_from_string($line)) {
				$partida = NULL;
			}
		}
	}

	public static function grapse($fh) {
		global $globals;
		if (!$globals->is_trapezi()) {
			return;
		}

		$globals->trapezi->set_energos_pektis();
		Globals::put_line($fh, "@PARTIDA@");
		$globals->trapezi->print_raw_data($fh);
	}

	public static function print_json_data($curr, $prev = FALSE) {
		if (($prev !== FALSE) && ($prev == $curr)) {
			return;
		}

		print ",partida:{";
		if (isset($curr)) {
			print "k:" . $curr->kodikos;
			print ",p1:'" . $curr->pektis1 . "'" . ",a1:" . $curr->apodoxi1;
			if ($curr->online1) { print ",o1:1"; }
			print ",p2:'" . $curr->pektis2 . "'" . ",a2:" . $curr->apodoxi2;
			if ($curr->online2) { print ",o2:1"; }
			print ",p3:'" . $curr->pektis3 . "'" . ",a3:" . $curr->apodoxi3;
			if ($curr->online3) { print ",o3:1"; }
			print ",s:" . $curr->kasa . ",p:" . $curr->prive .
				",t:" . $curr->theatis . ",h:" . $curr->thesi;
		}
		print "}";
	}

	public static function process() {
		global $globals;

		if (!$globals->is_trapezi()) {
			return(NULL);
		}

		$globals->trapezi->set_energos_pektis();

		$p = new Partida();
		$p->kodikos = $globals->trapezi->kodikos;
		$p->pektis1 = $globals->trapezi->pektis1;
		$p->apodoxi1 = $globals->trapezi->apodoxi1;
		$p->online1 = $globals->trapezi->online1;
		$p->pektis2 = $globals->trapezi->pektis2;
		$p->apodoxi2 = $globals->trapezi->apodoxi2;
		$p->online2 = $globals->trapezi->online2;
		$p->pektis3 = $globals->trapezi->pektis3;
		$p->apodoxi3 = $globals->trapezi->apodoxi3;
		$p->online3 = $globals->trapezi->online3;
		$p->kasa = $globals->trapezi->kasa;
		$p->prive = $globals->trapezi->prive;
		$p->theatis = ($globals->trapezi->is_pektis() ? 0 : 1);
		$p->thesi = $globals->trapezi->thesi;
		return($p);
	}
}
?>
