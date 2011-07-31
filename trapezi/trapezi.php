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
	public $prive;

	public $theatis;
	public $thesi;

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
		unset($this->kasa);
		unset($this->prive);

		unset($this->theatis);
		unset($this->thesi);

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
		$query = "SELECT `τραπέζι`, `θέση` FROM `θεατής` " .
			"WHERE `παίκτης` LIKE " .  $globals->pektis->slogin;
		$result = $globals->sql_query($query);
		$row = @mysqli_fetch_array($result, MYSQLI_NUM);
		if ($row) {
			@mysqli_free_result($result);
			$this->theatis = 1;
			$this->thesi = $row[1];
			$query = "SELECT * FROM `τραπέζι` WHERE `κωδικός` = " . $row[0];
			$result = $globals->sql_query($query);
			$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
			if ($row) {
				@mysqli_free_result($result);
			}
			else {
				unset($this->theatis);
				unset($this->thesi);
			}
		}

		// Αν δεν έχω εντοπίσει τον παίκτη ως θεατή σε κάποιο τραπέζι, τότε
		// προσπαθώ να τον εντοπίσω ως παίκτη.
		if (!$row) {
			$query = "SELECT * FROM `τραπέζι` WHERE " .
				"((`παίκτης1` LIKE " . $globals->pektis->slogin . ") " .
				"OR (`παίκτης2` LIKE " . $globals->pektis->slogin . ") " .
				"OR (`παίκτης3` LIKE " . $globals->pektis->slogin . ")) " .
				"AND (`τέλος` IS NULL) ORDER BY `κωδικός` DESC LIMIT 1";
			$result = $globals->sql_query($query);
			$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
			if ($row) {
				@mysqli_free_result($result);
				for ($i = 1; $i <= 3; $i++) {
					if ($row["παίκτης" . $i] == $globals->pektis->login) {
						$this->theatis = 0;
						$this->thesi = $i;
						break;
					}
				}
				if ($i > 3) {
					$this->error = $errmsg . 'βρέθηκε τραπέζι για τον παίκτη "' .
						$globals->pektis->login . '", αλλά η θέση είναι ' .
						'ακαθόριστη';
					return;
				}
			}
			else {
				$this->error = $errmsg . 'δεν βρέθηκε τραπέζι για τον παίκτη "' .
					$globals->pektis->login . '"';
				return;
			}
		}

		$this->set_from_dbrow($row);
	}

	public function set_from_dbrow($row, $basic = TRUE) {
		$this->kodikos = $row['κωδικός'];
		$this->pektis1 = $row['παίκτης1'];
		$this->apodoxi1 = ($row['αποδοχή1'] == 'YES' ? 1 : 0);
		$this->pektis2 = $row['παίκτης2'];
		$this->apodoxi2 = ($row['αποδοχή2'] == 'YES' ? 1 : 0);
		$this->pektis3 = $row['παίκτης3'];
		$this->apodoxi3 = ($row['αποδοχή3'] == 'YES' ? 1 : 0);
		$this->kasa = $row['κάσα'];
		$this->prive = ($row['ιδιωτικότητα'] == 'ΠΡΙΒΕ' ? 1 : 0);

		if ($basic) { return; }

		// μάζεμα διανομών και θέση των υπολοίπων πεδίων.
	}

	public function set_energos_pektis($energos = FALSE) {
		if ($energos === FALSE) { $energos = Prefadoros::energos_pektis(); }
		for ($i = 1; $i <= 3; $i++) {
			$pektis = "pektis" . $i;
			$online = "online" . $i;
			$this->$online = array_key_exists($this->$pektis, $energos) ? 1 : 0;
		}
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 12) { return(FALSE); }

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
		return(TRUE);
	}

	public function klidoma() {
		global $globals;
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

		$query = "SELECT * FROM `πρόσκληση` WHERE (`τραπέζι` = " .
			$this->kodikos . ") AND (`ποιον` LIKE '" .
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
		$errmsg = "Pektis(fetch_dianomi): ";
		unset($this->error);

		$query = "SELECT * FROM `διανομή` WHERE `τραπέζι` = " .
			$this->kodikos . " ORDER BY `κωδικός`";
		$result = @mysqli_query($globals->db, $query);
		if (!$result) {
			$this->error = $errmsg . 'SQL error (' .
				@mysqli_error($globals->db) . ')';
			return FALSE;
		}

		$proti = TRUE;
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			if ($proti) {
				$globals->dianomi = array();
				$proti = FALSE;
			}

			$globals->dianomi[] = new Dianomi(
				$row['κωδικός'],
				$row['dealer'],
				$row['κάσα1'],
				$row['μετρητά1'],
				$row['κάσα2'],
				$row['μετρητά2'],
				$row['κάσα3'],
				$row['μετρητά3']
			);
		}

		return(!$proti);
	}

	public function fetch_kinisi() {
		global $globals;
		$errmsg = "Pektis(fetch_kinisi): ";
		unset($this->error);

		if ($globals->is_dianomi()) {
			$dianomi_wc = '=' . $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
		}
		else {
			$dianomi_wc = 'IS NULL';
		}

		$query = "SELECT * FROM `κίνηση` WHERE `διανομή` " .
			$dianomi_wc . " ORDER BY `κωδικός`";
		$result = @mysqli_query($globals->db, $query);
		if (!$result) {
			$this->error = $errmsg . 'SQL error (' .
				@mysqli_error($globals->db) . ')';
			return FALSE;
		}

		$proti = TRUE;
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			if ($proti) {
				$globals->kinisi = array();
				$proti = FALSE;
			}

			$globals->kinisi[] = new Kinisi(
				$row['κωδικός'],
				$row['παίκτης'],
				$row['είδος'],
				$row['data']
			);
		}

		return(!$proti);
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
			$this->prive);
		if ($full) {
			fwrite($fh,
				"\t" . $this->theatis .
				"\t" . $this->thesi);
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
		print ",s:" . $this->kasa . ",r:" . $this->prive . "}";
	}
}
?>
