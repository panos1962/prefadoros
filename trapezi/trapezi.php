<?php
class Trapezi {
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

	public $ipolipo;
	public $kapikia1;
	public $kapikia2;
	public $kapikia3;
	public $dealer;

	public $error;

	public function __construct($auto = TRUE) {
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

		if (!$auto) {
			return;
		}

		// Θα επιχειρήσουμε να βρούμε το τρέχον τραπέζι για τον παίκτη.
		// Αν υπάρχει εγγραφή στον πίνακα "θεατής", τότε αυτό υπερισχύει,
		// αλλιώς ψάχνουμε σε ποιο ενεργό τραπέζι συμμετέχει ο παίκτης.

		Prefadoros::pektis_check();
		$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

		$query = "SELECT `τραπέζι`, `θέση` FROM `θεατής` " .
			"WHERE `παίκτης` LIKE " .  $slogin;
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
				"((`παίκτης1` LIKE " . $slogin . ") " .
				"OR (`παίκτης2` LIKE " . $slogin . ") " .
				"OR (`παίκτης3` LIKE " . $slogin . ")) " .
				"AND (`τέλος` IS NULL) ORDER BY `κωδικός` DESC LIMIT 1";
			$result = $globals->sql_query($query);
			$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
			if ($row) {
				@mysqli_free_result($result);
				$this->theatis = 0;
				if ($row['παίκτης1'] == $globals->pektis->login) {
					$this->thesi = 1;
				}
				elseif ($row['παίκτης2'] == $globals->pektis->login) {
					$this->thesi = 2;
				}
				elseif ($row['παίκτης3'] == $globals->pektis->login) {
					$this->thesi = 3;
				}
				else {
					$this->theatis = 1;
					$this->thesi = 1;
				}
			}
			else {
				$this->error = $errmsg . 'δεν βρέθηκε τραπέζι για τον παίκτη "' .
					$globals->pektis->login . '"';
				return;
			}
		}

		$this->kodikos = $row['κωδικός'];
		$this->pektis1 = $row['παίκτης1'];
		$this->apodoxi1 = ($row['αποδοχή1'] == 'YES' ? 1 : 0);
		$this->pektis2 = $row['παίκτης2'];
		$this->apodoxi2 = ($row['αποδοχή2'] == 'YES' ? 1 : 0);
		$this->pektis3 = $row['παίκτης3'];
		$this->apodoxi3 = ($row['αποδοχή3'] == 'YES' ? 1 : 0);
		$this->kasa = $row['κάσα'];
		$this->prive = ($row['ιδιωτικότητα'] == 'ΠΡΙΒΕ' ? 1 : 0);
	}

	public function is_theatis() {
		return($this->theatis == 1);
	}

	public function is_pektis() {
		return(!$this->is_theatis());
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

	public function klidoma() {
		global $globals;
		return($globals->klidoma('trapezi:' . $this->kodikos));
	}

	public function xeklidoma($ok) {
		global $globals;
		$globals->xeklidoma('trapezi:' . $this->kodikos, $ok);
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

	public function set_from_dbrow($row) {
		$this->kodikos = $row['κωδικός'];
		$this->pektis1 = $row['παίκτης1'];
		$this->apodoxi1 = ($row['αποδοχή1'] == 'YES' ? 1 : 0);
		$this->pektis2 = $row['παίκτης2'];
		$this->apodoxi2 = ($row['αποδοχή2'] == 'YES' ? 1 : 0);
		$this->pektis3 = $row['παίκτης3'];
		$this->apodoxi3 = ($row['αποδοχή3'] == 'YES' ? 1 : 0);
		$this->kasa = $row['κάσα'];
		$this->prive = ($row['ιδιωτικότητα'] == 'ΠΡΙΒΕ' ? 1 : 0);
		// μάζεμα διανομών και θέση των υπολοίπων πεδίων.
	}

	public function set_from_file($line) {
		$cols = explode("\t", $line);
		if (count($cols) != 9) {
			return(FALSE);
		}

		$nf = 0;
		$this->kodikos = $cols[$nf++];
		$this->pektis1 = $cols[$nf++];
		$this->apodoxi2 = $cols[$nf++];
		$this->pektis2 = $cols[$nf++];
		$this->apodoxi1 = $cols[$nf++];
		$this->pektis3 = $cols[$nf++];
		$this->apodoxi3 = $cols[$nf++];
		$this->kasa = $cols[$nf++];
		$this->prive = $cols[$nf++];
		return(TRUE);
	}

	public function print_raw_data($fh, $full = TRUE) {
		fwrite($fh, $this->kodikos . "\t" .
			$this->pektis1 . "\t" .
			$this->apodoxi1 . "\t" .
			$this->pektis2 . "\t" .
			$this->apodoxi2 . "\t" .
			$this->pektis3 . "\t" .
			$this->apodoxi3 . "\t" .
			$this->kasa . "\t" .
			$this->prive);
		if ($full) {
			fwrite($fh, "\t" . $this->theatis . "\t" . $this->thesi);
		}
		Globals::put_line($fh, '');
	}

	public function json_data() {
		print "{k:" . $this->kodikos .
			",p1:'" . $this->pektis1 . "',a1:" . $this->apodoxi1 .
			",p2:'" . $this->pektis2 . "',a2:" . $this->apodoxi2 .
			",p3:'" . $this->pektis3 . "',a3:" . $this->apodoxi3 .
			",s:" . $this->kasa . ",r:" . $this->prive . "}";
	}
}
?>
