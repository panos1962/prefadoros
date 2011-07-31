<?php
class Rebelos {
	public $login;
	public $theatis;

	public function __construct($login = FALSE) {
		global $globals;

		if ($login === FALSE) {
			unset($this->login);
			unset($this->theatis);
			return;
		}

		$this->login = $login;
		$this->theatis = 0;

		$query = "SELECT `τραπέζι` FROM `θεατής` WHERE `παίκτης` LIKE '" .
			$globals->asfales($login) . "'";
		$result = @mysqli_query($globals->db, $query);
		if($result) {
			$row = @mysqli_fetch_array($result, MYSQLI_NUM);
			if ($row) {
				@mysqli_free_result($result);
				$this->theatis = $row[0];
			}
		}
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 2) {
			return(FALSE);
		}

		$nf = 0;
		$this->login = $cols[$nf++];
		$this->theatis = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh) {
		Globals::put_line($fh, $this->login . "\t" . $this->theatis);
	}

	public function json_data() {
		print "{l:'" . $this->login . "'";
		if ($this->theatis != 0) {
			print ",t:" . $this->theatis;
		}
		print "}";
	}
}

function process_rebelos() {
	global $globals;

	$rebelos = array();
	$energos = Prefadoros::energos_pektis();

	$query = "SELECT `παίκτης1`, `παίκτης2`, `παίκτης3` FROM `τραπέζι` " .
		"WHERE `τέλος` IS NULL";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) { return($rebelos); }

	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		for ($i = 0; $i < 3; $i++) {
			if (array_key_exists($row[$i], $energos)) {
				$energos[$row[$i]] = FALSE;
			}
		}
	}

	foreach ($energos as $login => $reb) {
		if ($reb) {
			$rebelos[] = new Rebelos($login);
		}
	}

	return($rebelos);
}
?>
