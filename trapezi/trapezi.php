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
	public $kasa;
	public $ppp;
	public $asoi;
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

	public static function select_clause() {
		return("SELECT `kodikos`, `pektis1`, `apodoxi1`, `pektis2`, " .
			"`apodoxi2`, `pektis3`, `apodoxi3`, `kasa`, `pasopasopaso`, " .
			"`asoi`, `idiotikotita`, `prosvasi` FROM `trapezi` WHERE ");
	}

	public function __construct($trexon = TRUE) {
		global $globals;
		static $stmnt1 = NULL;
		static $stmnt2 = NULL;
		$errmsg = "Trapezi::construct(): ";

		unset($this->kodikos);
		unset($this->pektis1);
		unset($this->apodoxi1);
		unset($this->pektis2);
		unset($this->apodoxi2);
		unset($this->pektis3);
		unset($this->apodoxi3);
		unset($this->kasa);
		unset($this->ppp);
		unset($this->asoi);
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

		$row = array();

		if (isset($trapezi)) {
			if ($stmnt1 == NULL) {
				$query = self::select_clause() . "`kodikos` = ?";
				$stmnt1 = $globals->db->prepare($query);
				if (!$stmnt1) {
					die($errmsg . $query . ": failed to prepare");
				}
			}

			$stmnt1->bind_param("i", $trapezi);
			$stmnt1->execute();
			$stmnt1->bind_result($row['kodikos'], $row['pektis1'], $row['apodoxi1'],
				$row['pektis2'], $row['apodoxi2'], $row['pektis3'], $row['apodoxi3'],
				$row['kasa'], $row['pasopasopaso'], $row['asoi'],
				$row['idiotikotita'], $row['prosvasi']);
			$found = FALSE;
			while ($stmnt1->fetch()) {
				$found = TRUE;
			}
			if ($found) {
				$this->set_from_dbrow($row);
				return;
			}
		}

		if ($stmnt2 == NULL) {
			$query = self::select_clause() . "((`pektis1` LIKE ?) OR (`pektis2` LIKE ?) " .
				"OR (`pektis3` LIKE ?)) AND (`telos` IS NULL) " .
				"ORDER BY `kodikos` DESC LIMIT 1";
			$stmnt2 = $globals->db->prepare($query);
			if (!$stmnt2) {
				die($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt2->bind_param("sss", $globals->pektis->login,
			$globals->pektis->login, $globals->pektis->login);
		$stmnt2->execute();
		$stmnt2->bind_result($row['kodikos'], $row['pektis1'], $row['apodoxi1'],
			$row['pektis2'], $row['apodoxi2'], $row['pektis3'], $row['apodoxi3'],
			$row['kasa'], $row['pasopasopaso'], $row['asoi'],
			$row['idiotikotita'], $row['prosvasi']);
		$not_found = TRUE;
		while ($stmnt2->fetch()) {
			$not_found = FALSE;
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

	public function set_from_dbrow($row, $ipolipo = TRUE) {
		$this->kodikos = $row['kodikos'];
		$this->pektis1 = $row['pektis1'];
		$this->apodoxi1 = ($row['apodoxi1'] == 'YES' ? 1 : 0);
		$this->pektis2 = $row['pektis2'];
		$this->apodoxi2 = ($row['apodoxi2'] == 'YES' ? 1 : 0);
		$this->pektis3 = $row['pektis3'];
		$this->apodoxi3 = ($row['apodoxi3'] == 'YES' ? 1 : 0);
		$this->kasa = $row['kasa'];
		$this->ppp = ($row['pasopasopaso'] == 'YES' ? 1 : 0);
		$this->asoi = ($row['asoi'] == 'YES' ? 1 : 0);
		$this->prive = ($row['idiotikotita'] == 'ΔΗΜΟΣΙΟ' ? 0 : 1);
		$this->klisto = ($row['prosvasi'] == 'ΑΝΟΙΚΤΟ' ? 0 : 1);
		if ($ipolipo) {
			$this->ipolipo = self::ipolipo($row['kodikos'], $row['kasa']);
		}
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
		if (count($cols) != 16) { return(FALSE); }

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
		$this->ppp = $cols[$nf++];
		$this->asoi = $cols[$nf++];
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

	public function is_prosklisi($pektis = FALSE) {
		global $globals;
		if (!$pektis) {
			if (!$globals->is_pektis()) { return(FALSE); }
			$pektis = $globals->pektis->login;
		}

		$query = "SELECT * FROM `prosklisi` WHERE (`trapezi` = " .
			$this->kodikos . ") AND (`pion` LIKE '" .
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
			$this->kasa . "\t" .
			$this->ppp . "\t" .
			$this->asoi . "\t" .
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
		print ",s:" . $this->kasa;
		print ",i:" . $this->ipolipo;
		if ($this->ppp == 1) { print ",ppp:1"; }
		if ($this->asoi == 1) { print ",asoi:1"; }
		if ($this->prive == 1) { print ",r:1"; }
		if ($this->klisto == 1) { print ",b:1"; }
 		print "}";
	}

	public static function diagrafi($trapezi) {
		global $globals;

		// Επαναφέρω τους τελευταίους συμμετέχοντες παίκτες.
		$query = "SELECT * FROM `simetoxi` WHERE `trapezi` = " . $trapezi;
		$result = @mysqli_query($globals->db, $query);
		if ($result) {
			$pektis1 = '`pektis1`';
			$pektis2 = '`pektis2`';
			$pektis3 = '`pektis3`';
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$p = "pektis" . $row['thesi'];
				$$p = "'" . $globals->asfales($row['pektis']) . "'";
			}

			$query = "UPDATE `trapezi` SET `pektis1` = " . $pektis1 .
				", `pektis2` = " . $pektis2 . ", " .  "`pektis3` = " .
				$pektis3 . " WHERE `kodikos` = " . $trapezi;
			@mysqli_query($globals->db, $query);
		}

		// Αντιγραφή των δεδομένων του τραπεζιού (τραπέζι, διανομές, κινήσεις)
		// σε παράλληλους πίνακες ("trapezi_log", "dianomi_log", "kinisi_log").

		$query = "INSERT INTO `trapezi_log` (`kodikos`, `pektis1`, `pektis2`, " .
			"`pektis3`, `kasa`, `pasopasopaso`, `asoi`, `stisimo`, `telos`) " .
			"SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3`, " .
			"`kasa`, `pasopasopaso`, `asoi`, `stisimo`, `telos` " .
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

		// Υπάρχει λόγος που έχω χωριστά τη διαγραφή των προσκλήσεων.
		// Πρόκειται για bug που αφορά στο σχετικό trigger διαγραφής
		// των προσκλήσεων.
		$query = "DELETE FROM `prosklisi` WHERE `trapezi` = " . $trapezi;
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `trapezi` WHERE `kodikos` = " . $trapezi;
		@mysqli_query($globals->db, $query);
	}

	public static function ipolipo($kodikos, $kasa) {
		global $globals;
		static $stmnt = NULL;
		$errmsg = "Trapezi::ipolipo(): ";

		$kasa *= 30;

		if ($stmnt == NULL) {
			$query = "SELECT `kasa1`, `kasa2`, `kasa3` " .
				"FROM `dianomi` WHERE `trapezi` = ?";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				die($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->bind_param("i", $kodikos);
		$stmnt->execute();
		$stmnt->bind_result($kasa1, $kasa2, $kasa3);
		while ($stmnt->fetch()) {
			$kasa -= $kasa1;
			$kasa -= $kasa2;
			$kasa -= $kasa3;
		}

		return intval($kasa / 10);
	}
}
?>
