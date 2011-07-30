<?php
class Partida {
	public $kodikos;
	public $pektis1;
	public $apodoxi1;
	public $pektis2;
	public $apodoxi2;
	public $pektis3;
	public $apodoxi3;
	public $kasa;
	public $prive;
	public $theatis;
	public $thesi;

	public function __construct() {
		unset($this->kodikos);
		unset($this->pektis1);
		unset($this->apodoxi1);
		unset($this->pektis2);
		unset($this->apodoxi2);
		unset($this->pektis3);
		unset($this->apodoxi3);
		unset($this->kasa);
		unset($this->prive);
		unset($this->theatis);
		unset($this->thesi);
	}

	public function set_from_string($data) {
		$cols = explode("\t", $data);
		if (count($cols) != 11) {
			return(FALSE);
		}
			
		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pektis1 = $cols[$nf++];
		$this->apodoxi1 = $cols[$nf++];
		$this->pektis2 = $cols[$nf++];
		$this->apodoxi2 = $cols[$nf++];
		$this->pektis3 = $cols[$nf++];
		$this->apodoxi3 = $cols[$nf++];
		$this->kasa = $cols[$nf++];
		$this->prive = $cols[$nf++];
		$this->theatis = $cols[$nf++];
		$this->thesi = $cols[$nf++];
		return(TRUE);
	}
}

function process_partida() {
	global $globals;

	if (!$globals->is_trapezi()) {
		return(NULL);
	}

	$p = new Partida();
	$p->kodikos = intval($globals->trapezi->kodikos);
	$p->pektis1 = $globals->trapezi->pektis1;
	$p->apodoxi1 = $globals->trapezi->apodoxi1;
	$p->pektis2 = $globals->trapezi->pektis2;
	$p->apodoxi2 = $globals->trapezi->apodoxi2;
	$p->pektis3 = $globals->trapezi->pektis3;
	$p->apodoxi3 = $globals->trapezi->apodoxi3;
	$p->kasa = $globals->trapezi->kasa;
	$p->prive = $globals->trapezi->prive;
	$p->theatis = ($globals->trapezi->is_pektis() ? 0 : 1);
	$p->thesi = intval($globals->trapezi->thesi);
	return($p);
}
