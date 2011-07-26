<?php
class Prosklisi {
	public $kodikos;
	public $pios;
	public $pion;
	public $trapezi;
	public $pote;

	public function __construct() {
		unset($this->kofikos);
		unset($this->pios);
		unset($this->pion);
		unset($this->trapezi);
		unset($this->pote);
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->pios = $row['ποιος'];
		$this->pion = $row['ποιον'];
		$this->trapezi = $row['τραπέζι'];
		$this->pote = $row['πότε'];
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 5) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pios = $cols[$nf++];
		$this->pion = $cols[$nf++];
		$this->trapezi = $cols[$nf++];
		$this->pote = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->kodikos . "\t" . $this->pios . "\t" .
			$this->pion . "\t" . $this->trapezi . "\t" . $this->pote);
	}

	public function json_data() {
		print "{k:" . $this->kodikos . ",a:'" . $this->pios .
			"',p:'" . $this->pion . "',t:" . $this->trapezi .
			",s:" . $this->pote . "}";
	}
}

function process_prosklisi() {
	global $globals;
	global $sinedria;

	$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

	$peknpat = NULL;
	$query = "SELECT `κωδικός`, `ποιος`, `ποιον`, `τραπέζι`, " .
		"UNIX_TIMESTAMP(`πότε`) AS `πότε` FROM `πρόσκληση` " .
		"WHERE (`ποιος` LIKE " . $slogin . ") OR " .
		"(`ποιον` LIKE " . $slogin . ")"; 
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$p = new Prosklisi;
		$p->set_from_dbrow($row);
		$prosklisi[] = $p;
	}

	return $prosklisi;
}
?>
