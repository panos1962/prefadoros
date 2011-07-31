<?php
class Rebelos {
	public $login;
	public $theatis;

	public function __construct($login = FALSE, $trapezi = 0) {
		if ($login === FALSE) {
			unset($this->login);
			unset($this->theatis);
		}
		else {
			$this->login = $login;
			$this->theatis = $trapezi;
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

	// Δημιουργείται το array "energos" που περιέχει όλους
	// τους online παίκτες, δεικτοδοτημένο με τα login names
	// και τιμή TRUE.

	$energos = Prefadoros::energos_pektis();

	// Θα δημιουργήσουμε array "theatis" με όλους τους θεατές
	// σε ενεργά τραπέζια, δεικτοδοτημένο με τα login names
	// και τιμή τον κωδικό του θεώμενου τραπεζιού.

	$theatis = array();

	$query = "SELECT `παίκτης`, `τραπέζι` FROM `θεατής` " .
		"WHERE `τραπέζι` IN (SELECT `κωδικός` FROM `τραπέζι` " .
		"WHERE `τέλος` IS NULL)";
	$result = @mysqli_query($globals->db, $query);
	if ($result) {
		while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
			$theatis[$row[0]] = $row[1];
		}
	}

	// Θα θέσω τιμή FALSE σε όσους παίκτες του array "energos" συμμετέχουν
	// ως παίκτες σε ενεργά τραπέζια.

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
			$rebelos[] = new Rebelos($login, $theatis[$login]);
		}
		elseif ($reb) {
			$rebelos[] = new Rebelos($login, 0);
		}
	}

	return($rebelos);
}
?>
