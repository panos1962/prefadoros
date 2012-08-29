<?php
class Trapezi {
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
	public $idioktito;
	public $efe;
	public $kasa;
	public $ppp;
	public $asoi;
	public $postel;
	public $learner;
	public $prive;
	public $klisto;
	public $thesi;
	public $theatis;

	public $ipolipo;
	public $kapikia1;
	public $kapikia2;
	public $kapikia3;
	public $dealer;

	public $error;

	public function __construct($trexon = TRUE) {
		global $globals;
		$errmsg = "Trapezi::construct(): ";

		unset($this->kodikos);
		unset($this->pektis1);
		unset($this->apodoxi1);
		unset($this->pektis2);
		unset($this->apodoxi2);
		unset($this->pektis3);
		unset($this->apodoxi3);
		unset($this->idioktito);
		unset($this->efe);
		unset($this->kasa);
		unset($this->ppp);
		unset($this->asoi);
		unset($this->postel);
		unset($this->learner);
		unset($this->prive);
		unset($this->klisto);
		unset($this->thesi);
		unset($this->theatis);

		unset($this->ipolipo);
		unset($this->kapikia1);
		unset($this->kapikia2);
		unset($this->kapikia3);

		unset($this->error);

		if (!$trexon) {
			return;
		}

		// Υποτίθεται ότι ο παίκτης είναι καθορισμένος και θα
		// επιχειρήσουμε να βρούμε το τρέχον τραπέζι για τον παίκτη.
		// Αν υπάρχει εγγραφή στον πίνακα "θεατής", τότε αυτό υπερισχύει,
		// αλλιώς ψάχνουμε το τελευταίο ενεργό τραπέζι στο οποίο
		// συμμετέχει ο παίκτης.
		Prefadoros::pektis_check();

		// Εντοπίζουμε τραπέζι στο οποίο συμμετέχει ο παίκτης ως θεατής.
		unset($trapezi);
		$theatis = Prefadoros::lista_theaton();
		if (array_key_exists($globals->pektis->login, $theatis)) {
			$trapezi = $theatis[$globals->pektis->login]->trapezi;
			$this->thesi = $theatis[$globals->pektis->login]->thesi;
			$this->theatis = 1;
		}

		if (isset($trapezi)) {
			$query = "SELECT * FROM `trapezi` WHERE `kodikos` = " . $trapezi;
			$result = $globals->sql_query($query);
			while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				@mysqli_free_result($result);
				$this->set_from_dbrow($row);
				return;
			}
		}

		// Δεν εντοπίστηκε τραπέζι στο οποίο ο παίκτης να είναι θεατής.
		// Εντοπίζουμε το νεότερο τραπέζι στο οποίο συμμετέχει ως παίκτης.
		$query = "SELECT * FROM `trapezi` WHERE (" .
			"(`pektis1` = BINARY " . $globals->pektis->slogin . ") OR " .
			"(`pektis2` = BINARY " . $globals->pektis->slogin . ") OR " .
			"(`pektis3` = BINARY " . $globals->pektis->slogin . ")" .
			") AND (`telos` IS NULL) ORDER BY `kodikos` DESC LIMIT 1";
		$result = $globals->sql_query($query);
		$not_found = TRUE;
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			@mysqli_free_result($result);
			$not_found = FALSE;
			break;
		}

		if ($not_found) {
			$this->error = $errmsg . 'δεν βρέθηκε τραπέζι για τον παίκτη "' .
				$globals->pektis->login . '"';
			return;
		}

		for ($i = 1; $i <= 3; $i++) {
			if ($row["pektis" . $i] == $globals->pektis->login) {
				$this->thesi = $i;
				$this->theatis = 0;
				break;
			}
		}
		if ($i > 3) {
			$this->error = $errmsg . 'βρέθηκε τραπέζι για τον παίκτη "' .
				$globals->pektis->login . '", αλλά η θέση είναι ' .
				'ακαθόριστη';
			return;
		}

		$this->set_from_dbrow($row);
	}

	public function set_from_dbrow($row) {
		$this->kodikos = $row['kodikos'];
		$this->pektis1 = $row['pektis1'];
		$this->apodoxi1 = ($row['apodoxi1'] == 'YES' ? 1 : 0);
		$this->pektis2 = $row['pektis2'];
		$this->apodoxi2 = ($row['apodoxi2'] == 'YES' ? 1 : 0);
		$this->pektis3 = $row['pektis3'];
		$this->apodoxi3 = ($row['apodoxi3'] == 'YES' ? 1 : 0);
		$this->idioktito = ($row['idioktisia'] == 'ΙΔΙΟΚΤΗΤΟ' ? 1 : 0);
		$this->efe = $row['efe'];
		$this->kasa = $row['kasa'];
		$this->ppp = ($row['pasopasopaso'] == 'YES' ? 1 : 0);
		$this->asoi = ($row['asoi'] == 'YES' ? 1 : 0);
		switch ($row['postel']) {
		case 'ΑΝΙΣΟΡΡΟΠΗ':	$this->postel = 1; break;
		case 'ΔΙΚΑΙΗ':		$this->postel = 2; break;
		default:		$this->postel = 0; break;
		}
		$this->learner = ($row['learner'] == 'YES' ? 1 : 0);
		$this->prive = ($row['idiotikotita'] == 'ΔΗΜΟΣΙΟ' ? 0 : 1);
		$this->klisto = ($row['prosvasi'] == 'ΑΝΟΙΚΤΟ' ? 0 : 1);
		$this->ipolipo = (3 * $row['kasa']) - $row['pistosi'];
	}

	public function set_energos_pektis($energos = FALSE) {
		global $globals;

		if ($energos === FALSE) {
			$energos = Prefadoros::energos_pektis();
		}

		$kapios = FALSE;
		for ($i = 1; $i <= 3; $i++) {
			$pektis = "pektis" . $i;
			$online = "online" . $i;
			if (array_key_exists($this->$pektis, $energos)) {
				$this->$online = 1;
				$kapios = TRUE;
			}
			else {
				$this->$online = 0;
			}
		}
		if ($kapios) {
			return(TRUE);
		}

		// Το τραπέζι δεν έχει ενεργούς παίκτες. Ψάχνουμε μήπως έχει
		// ενεργούς θεατές.

		$tlist = Prefadoros::lista_theaton();
		foreach ($tlist as $pektis => $theatis) {
			if ($theatis->trapezi != $this->kodikos) {
				continue;
			}

			if (array_key_exists($pektis, $energos)) {
				$kapios = TRUE;
				break;
			}
		}
		return $kapios;
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 20) { return(FALSE); }

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
		$this->idioktito = $cols[$nf++];
		$this->efe = $cols[$nf++];
		$this->kasa = $cols[$nf++];
		$this->ppp = $cols[$nf++];
		$this->asoi = $cols[$nf++];
		$this->postel = $cols[$nf++];
		$this->learner = $cols[$nf++];
		$this->prive = $cols[$nf++];
		$this->klisto = $cols[$nf++];
		$this->ipolipo = $cols[$nf++];
		return(TRUE);
	}

	public function klidoma() {
		global $globals;
		@mysqli_autocommit($globals->db, FALSE);
		return($globals->klidoma('trapezi:' . $this->kodikos));
	}

	public function xeklidoma($ok) {
		global $globals;
		$globals->xeklidoma('trapezi:' . $this->kodikos, $ok);
	}

	public function is_theatis() {
		return($this->theatis == 1);
	}

	public function is_pektis() {
		return(!$this->is_theatis());
	}

	public function is_idioktito() {
		return($this->idioktito == 1);
	}

	public function not_idioktito() {
		return(!$this->is_idioktito());
	}

	public function is_prosklisi($pektis = FALSE) {
		global $globals;
		if (!$pektis) {
			if (!$globals->is_pektis()) { return(FALSE); }
			$pektis = $globals->pektis->login;
		}

		$query = "SELECT * FROM `prosklisi` WHERE (`trapezi` = " .
			$this->kodikos . ") AND (`pion` = BINARY '" .
			$globals->asfales($pektis) . "')";
		$result = $globals->sql_query($query);
		if (!$result) { return(FALSE); }

		$row = @mysqli_fetch_array($result, MYSQLI_NUM);
		if (!$row) { return(FALSE); }

		@mysqli_free_result($result);
		return(TRUE);
	}

	public function fetch_dianomi() {
		global $globals;

		$query = "SELECT * FROM `dianomi` WHERE `trapezi` = " .
			$this->kodikos . " ORDER BY `kodikos`";
		$result = $globals->sql_query($query);

		$globals->dianomi = array();
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$d = new Dianomi;
			$d->set_from_dbrow($row);
			$globals->dianomi[] = $d;
		}
	}

	public function print_raw_data($fh, $full = TRUE) {
		fwrite($fh,
			$this->kodikos . "\t" .
			$this->pektis1 . "\t" .
			$this->apodoxi1 . "\t" .
			$this->online1 . "\t" .
			$this->pektis2 . "\t" .
			$this->apodoxi2 . "\t" .
			$this->online2 . "\t" .
			$this->pektis3 . "\t" .
			$this->apodoxi3 . "\t" .
			$this->online3 . "\t" .
			$this->idioktito . "\t" .
			$this->efe . "\t" .
			$this->kasa . "\t" .
			$this->ppp . "\t" .
			$this->asoi . "\t" .
			$this->postel . "\t" .
			$this->learner . "\t" .
			$this->prive . "\t" .
			$this->klisto . "\t" .
			$this->ipolipo);
		if ($full) {
			fwrite($fh,
				"\t" . $this->thesi .
				"\t" . $this->theatis);
		}
		Globals::put_line($fh, '');
	}

	public function json_data() {
		print "{k:" . $this->kodikos;
		for ($i = 1; $i <= 3; $i++) {
			$pektis = "pektis" . $i;
			$apodoxi = "apodoxi" . $i;
			$online = "online" . $i;
			print ",p" . $i . ":'" . $this->$pektis . "'";
			if ($this->$apodoxi != 1) {
				print ",a" . $i . ":" . $this->$apodoxi;
			}
			if ($this->$online) {
				print ",o" . $i . ":1";
			}
		}
		if ($this->idioktito == 1) { print ",d:1"; }
		print ",s:" . $this->kasa;
		print ",i:" . $this->ipolipo;
		if ($this->ppp == 1) { print ",ppp:1"; }
		if ($this->asoi == 1) { print ",asoi:1"; }
		if ($this->postel != 0) { print ",postel:" . $this->postel; }
		if ($this->learner == 1) { print ",learner:1"; }
		if ($this->prive == 1) { print ",r:1"; }
		if ($this->klisto == 1) { print ",b:1"; }
		if ($this->efe != '') { print ",e:'" . $this->efe . "'"; }
 		print "}";
	}

	public static function diagrafi($trapezi) {
		global $globals;

		// Για να κρατήσω αρχείο πρέπει να έχω τουλάχιστον μια παιγμένη
		// διανομή στο τραπέζι.

		$keep_log = FALSE;
		$query = "SELECT `kodikos` FROM `dianomi` WHERE `trapezi` = " . $trapezi .
			" AND ((`kasa1` <> 0) OR (`kasa2` <> 0) OR (`kasa3` <> 0)) LIMIT 1";
		$result = @mysqli_query($globals->db, $query);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			$keep_log = TRUE;
		}

		// Αν βρήκα έστω μια διανομή στο τραπέζι, τότε ελέγχω τους τελευταίους
		// συμμετέχοντες παίκτες. Για να κρατήσω αρχείο πρέπει, επίσης, να εντοπίσω
		// εγγραφές συμμετοχής για τους παίκτες που ίσως έχουν αποχωρήσει.

		if ($keep_log) {
			$keep_log = FALSE;

			$pektis1 = '';
			$pektis2 = '';
			$pektis3 = '';

			// Πρώτα συμπληρώνω με τους παίκτες που μετέχουν αυτή τη στιγμή στο
			// τραπέζι. Παίρνω και τον κωδικό, ώστε να πέσουν οι παίκτες στις
			// θέσεις 1, 2, και 3 του projection list.

			$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` FROM `trapezi` " .
				"WHERE `kodikos` = " . $trapezi;
			$result = @mysqli_query($globals->db, $query);
			if ($result) {
				while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
					for ($i = 1; $i <= 3; $i++) {
						if (($pektis = trim($row[$i])) != '') {
							$p = "pektis" . $i;
							$$p = "'" . $globals->asfales($pektis) . "'";
						}
					}
				}
			}

			// Τώρα θα πάρω τις τελευταίες συμμετοχές, ώστε να συμπληρώσω τους
			// παίκτες που ίσως λείπουν.

			$query = "SELECT `thesi`, `pektis` FROM `simetoxi` WHERE `trapezi` = " . $trapezi;
			$result = @mysqli_query($globals->db, $query);
			if ($result) {
				while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
					$p = "pektis" . $row[0];
					if ($$p == '') {
						$$p = "'" . $globals->asfales($row[1]) . "'";
					}
				}
			}

			$keep_log = (($pektis1 != '') && ($pektis2 != '') && ($pektis3 != ''));
		}

		// Αντιγραφή των δεδομένων του τραπεζιού (τραπέζι, διανομές, κινήσεις)
		// σε παράλληλους πίνακες ("trapezi_log", "dianomi_log", "kinisi_log").

		if ($keep_log) {
			// Επαναφέρω τους τελευταίους συμμετέχοντες παίκτες.
			$query = "UPDATE `trapezi` SET `pektis1` = " . $pektis1 .
				", `pektis2` = " . $pektis2 . ", " .  "`pektis3` = " .
				$pektis3 . " WHERE `kodikos` = " . $trapezi;
			@mysqli_query($globals->db, $query);

			$query = "INSERT INTO `trapezi_log` (`kodikos`, `pektis1`, `pektis2`, " .
				"`pektis3`, `kasa`, `pasopasopaso`, `asoi`, `postel`, " .
				"`learner`, `stisimo`, `telos`) " .
				"SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3`, " .
				"`kasa`, `pasopasopaso`, `asoi`, `postel`, " .
				"`learner`, `stisimo`, `telos` " .
				"FROM `trapezi` WHERE `kodikos` = " . $trapezi;
			@mysqli_query($globals->db, $query);

			$query = "INSERT INTO `dianomi_log` (`kodikos`, `trapezi`, `dealer`, `kasa1`, " .
				"`metrita1`, `kasa2`, `metrita2`, `kasa3`, `metrita3`, `enarxi`) " .
				"SELECT `kodikos`, `trapezi`, `dealer`, `kasa1`, `metrita1`, " .
				"`kasa2`, `metrita2`, `kasa3`, `metrita3`, `enarxi` " .
				"FROM `dianomi` WHERE `trapezi` = " . $trapezi;
			@mysqli_query($globals->db, $query);

			$query = "INSERT INTO `kinisi_log` (`kodikos`, `dianomi`, `pektis`, " .
				"`idos`, `data`, `pote`) SELECT `kodikos`, `dianomi`, `pektis`, " .
				"`idos`, `data`, `pote` FROM `kinisi` WHERE `dianomi` IN " .
				"(SELECT `kodikos` FROM `dianomi` WHERE `trapezi` = " . $trapezi . ")";
			@mysqli_query($globals->db, $query);
		}

		// Υπάρχει λόγος που έχω χωριστά τη διαγραφή των προσκλήσεων.
		// Πρόκειται για bug που αφορά στο σχετικό trigger διαγραφής
		// των προσκλήσεων.
		$query = "DELETE FROM `prosklisi` WHERE `trapezi` = " . $trapezi;
		@mysqli_query($globals->db, $query);

		// Η διαγραφή της συζήτησης γίνεται χωριστά επειδή ο πίνακας
		// είναι memory και μάλλον μετατρέπει το foreign key σε απλό
		// index.
		$query = "DELETE FROM `sizitisi` WHERE `trapezi` = " . $trapezi;
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `trapezi` WHERE `kodikos` = " . $trapezi;
		@mysqli_query($globals->db, $query);
	}
}
?>
