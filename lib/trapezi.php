<?php
class Trapezi {
	public $kodikos;
	public $pektis1;
	public $apodoxi1;
	public $idle1;
	public $pektis2;
	public $apodoxi2;
	public $idle2;
	public $pektis3;
	public $apodoxi3;
	public $idle3;
	public $kasa;
	public $error;

	public function __construct($pektis = NULL) {
		global $globals;
		$errmsg = "Trapezi(construct): ";

		unset($this->kodikos);
		unset($this->pektis1);
		unset($this->apodoxi1);
		unset($this->idle1);
		unset($this->pektis2);
		unset($this->apodoxi2);
		unset($this->idle2);
		unset($this->pektis3);
		unset($this->apodoxi3);
		unset($this->idle3);
		unset($this->kasa);
		unset($this->error);

		if (!isset($pektis)) {
			if ($globals->is_pektis()) {
				$pektis = $globals->pektis->login;
			}
			else {
				$this->error = $errmsg . ': ακαθόριστος παίκτης';
				return;
			}
		}

		// Εντοπίζω το πιο "φρέσκο" ενεργό τραπέζι στο οποίο συμμετέχει
		// ο παίκτης. Αν δεν είναι το τραπέζι που τον ενδιαφέρει, πρέπει
		// να εξέλθει από το τραπέζι για να μεταφερθεί στο αμέσως προηγούμενο
		// κοκ. Πριν επιχειρήσει έξοδο, είναι καλό να διασφαλίσει ότι υπάρχει
		// πρόσκληση για το τραπέζι, ώστε να μπορεί αργότερα να επανέλθει,
		// εφόσον, φυσικά, το επιθυμεί.

		$login = $globals->asfales($pektis);
		$query = "SELECT `κωδικός`, " .
			"`παίκτης1`, `αποδοχή1`, UNIX_TIMESTAMP(`poll1`) AS `poll1`, " .
			"`παίκτης2`, `αποδοχή2`, UNIX_TIMESTAMP(`poll2`) AS `poll2`, " .
			"`παίκτης3`, `αποδοχή3`, UNIX_TIMESTAMP(`poll3`) AS `poll3`, " .
			"`κάσα` FROM `τραπέζι` " .
			"WHERE ((`παίκτης1` LIKE '" . $login . "') " .
			"OR (`παίκτης2` LIKE '" . $login . "') " .
			"OR (`παίκτης3` LIKE '" . $login . "')) " .
			"AND `διάλυση` IS NULL ORDER BY `κωδικός` DESC LIMIT 1";
		$result = @mysqli_query($globals->db, $query);
		if (!$result) {
			$this->error = $errmsg . 'SQL error (' .
				@mysqli_error($globals->db) . ')';
			return;
		}

		$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
		if (!$row) {
			$this->error = $errmsg . 'δεν βρέθηκε τραπέζι για τον παίκτη "' .
				$pektis . '"';
			return;
		}
		@mysqli_free_result($result);

		$tora = time();
		$this->kodikos = $row['κωδικός'];
		$this->pektis1 = $row['παίκτης1'];
		$this->apodoxi1 = $row['αποδοχή1'];
		$this->idle1 = (is_numeric($row['poll1']) ? $tora - $row['poll1'] : $tora);
		$this->pektis2 = $row['παίκτης2'];
		$this->apodoxi2 = $row['αποδοχή2'];
		$this->idle2 = (is_numeric($row['poll2']) ? $tora - $row['poll2'] : $tora);
		$this->pektis3 = $row['παίκτης3'];
		$this->apodoxi3 = $row['αποδοχή3'];
		$this->idle3 = (is_numeric($row['poll3']) ? $tora - $row['poll3'] : $tora);
		$this->kasa = $row['κάσα'];
	}

	static public function dialisi_adio() {
		global $globals;

		$query = "UPDATE `τραπέζι` SET `διάλυση` = NOW() " .
			"WHERE `διάλυση` IS NULL AND `παίκτης1` IS NULL " .
			"AND `παίκτης2` IS NULL AND `παίκτης3` IS NULL";
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `πρόσκληση` WHERE `τραπέζι` IN (" .
			"SELECT `κωδικός` FROM `τραπέζι` " .
			"WHERE `διάλυση` IS NOT NULL)";
		@mysqli_query($globals->db, $query);
	}

	public function thesi_pekti($out = TRUE) {
		global $globals;
		$errmsg = "Pektis(thesi_pekti): ";
		unset($this->error);

		if (!$globals->is_pektis()) {
			$this->error = $errmsg . 'ακαθόριστος παίκτης';
			if ($out) {
				telos($this->error);
			}

			return(FALSE);
		}
		$pektis = $globals->pektis->login;

		$query = "SELECT `παίκτης1`, `παίκτης2`, `παίκτης3` " .
			"FROM `τραπέζι` WHERE `κωδικός` = " . $this->kodikos;
		$result = @mysqli_query($globals->db, $query);
		if (!$result) {
			$this->error = $errmsg . 'SQL error (' .
				@mysqli_error($globals->db) . ')';
			if ($out) {
				telos($this->error);
			}

			return(FALSE);
		}

		$row = mysqli_fetch_array($result, MYSQLI_NUM);
		if (!$row) {
			$this->error = $errmsg . 'δεν βρέθηκε το τραπέζι ' . $this->kodikos;
			if ($out) {
				telos($this->error);
			}

			return(FALSE);
		}
		mysqli_free_result($result);

		for ($i = 0; $i < 3; $i++) {
			if ($row[$i] == $globals->pektis->login) {
				return($i + 1);
			}
		}

		$this->error = $errmsg . 'δεν βρέθηκε ο παίκτης "' .
			$pektis . '" στο τραπέζι ' . $this->kodikos;
		if ($out) {
			telos($this->error);
		}

		return(FALSE);
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
		return(klidoma('trapezi:' . $this->kodikos));
	}

	public function xeklidoma($ok) {
		xeklidoma('trapezi:' . $this->kodikos, $ok);
	}
}
?>
