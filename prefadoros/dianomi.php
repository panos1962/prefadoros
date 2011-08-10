<?php
class Dianomi {
	public $kodikos;
	public $dealer;
	public $kasa1;
	public $metrita1;
	public $kasa2;
	public $metrita2;
	public $kasa3;
	public $metrita3;

	public function __construct($kodikos, $dealer, $kasa1, $metrita1,
		$kasa2, $metrita2, $kasa3, $metrita3) {
		$this->kodikos = $kodikos;
		$this->dealer = $dealer;
		$this->kasa1 = $kasa1;
		$this->metrita1 = $metrita1;
		$this->kasa2 = $kasa2;
		$this->metrita2 = $metrita2;
		$this->kasa3 = $kasa3;
		$this->metrita3 = $metrita3;
	}
}
?>
