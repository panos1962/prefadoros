<?php
class Permes {
	public $kodikos;
	public $apostoleas;
	public $minima;
	public $dimiourgia;

	public function __construct() {
		$this->kodikos = 0;
		$this->apostoleas = '';
		$this->minima = '';
		$this->dimiourgia = '';
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->apostoleas = $row['αποστολέας'];
		$this->minima = preg_replace("/\n/", "&#10;", $row['μήνυμα']);
		$this->dimiourgia = $row['δημιουργία'];
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 4) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->apostoleas = $cols[$nf++];
		$this->minima = $cols[$nf++];
		$this->dimiourgia = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->kodikos . "\t" .  $this->apostoleas .
			"\t" . $this->minima . "\t" . $this->dimiourgia);
	}

	public function json_data() {
		$minima = preg_replace('/\\\/', '\\\\\\', $this->minima);
		$minima = preg_replace("/'/", "\'", $minima);
		$minima = preg_replace('/"/', '\"', $minima);
		print "{k:" . $this->kodikos . ",a:'" . $this->apostoleas .
			"',m:'" . $minima .  "',d:" . $this->dimiourgia . "}";
	}
}

function process_permes() {
	global $globals;
	$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

	$permes = array();
	$query = "SELECT `κωδικός`, `αποστολέας`, `μήνυμα`, `κατάσταση`, " .
		"UNIX_TIMESTAMP(`δημιουργία`) AS `δημιουργία` " .
		"FROM `μήνυμα` WHERE (`παραλήπτης` LIKE " . $slogin .
		") AND (`κατάσταση` LIKE 'ΝΕΟ') ORDER BY `κωδικός`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$p = new Permes;
		$p->set_from_dbrow($row);
		$permes[] = $p;
	}

	return $permes;
}
?>
