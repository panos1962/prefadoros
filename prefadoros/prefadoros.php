<?php
class Prefadoros {
	public static function set_pektis($login = FALSE) {
		global $globals;

		if ($globals->is_pektis()) {
			Globals::fatal('Επανακαθορισμός παίκτη');
		}

		if ($login) {
			$globals->pektis = new Pektis($login);
			if (!isset($globals->pektis->login)) {
				unset($globals->pektis);
			}
		}
		elseif (Globals::session_set('ps_login')) {
			$globals->pektis = new Pektis($_SESSION['ps_login']);
			if (!isset($globals->pektis->login)) {
				unset($_SESSION['ps_login']);
				unset($globals->pektis);
			}
		}
	}

	public static function pektis_check($login = FALSE) {
		global $globals;

		if (!$globals->is_pektis()) {
			self::set_pektis($login);
			if (!$globals->is_pektis()) {
				Globals::fatal('Ακαθόριστος παίκτης');
			}
		}
	}

	public static function set_trapezi() {
		global $globals;

		if ($globals->is_trapezi()) {
			Globals::fatal('Επανακαθορισμός τραπεζιού');
		}

		if (!$globals->is_pektis()) {
			return(FALSE);
		}

		$globals->trapezi = new Trapezi();
		if (!isset($globals->trapezi->kodikos)) {
			unset($globals->trapezi);
			return(FALSE);
		}

		return(TRUE);
	}

	public static function trapezi_check() {
		global $globals;

		if (!$globals->is_trapezi()) {
			self::set_trapezi();
			if (!$globals->is_trapezi()) {
				Globals::fatal('Ακαθόριστο τραπέζι');
			}
		}
	}

	public static function dianomi_check() {
		global $globals;

		if (!$globals->is_dianomi()) {
			self::set_dianomi();
			if (!$globals->is_dianomi()) {
				Globals::fatal('Ακαθόριστη διανομή');
			}
		}
	}

	public static function set_dianomi() {
		global $globals;

		if (!$globals->is_trapezi()) {
			Globals::fatal('Ακαθόριστο τραπέζι για μάζεμα διανομών');
		}

		$globals->dianomi = array();
		$query = "SELECT * FROM `dianomi` WHERE `trapezi` = " .
			$globals->trapezi->kodikos . " ORDER BY `kodikos`";
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$d = new Dianomi;
			$d->set_from_dbrow($row);
			$globals->dianomi[] = $d;
		}
	}

	public static function klidose_trapezi() {
		global $globals;

		if (!$globals->is_trapezi()) {
			telos('Ακαθόριστο τραπέζι');
		}

		if (!$globals->trapezi->klidoma()) {
			telos('Τραπέζι σε ενημέρωση');
		}
	}

	public static function xeklidose_trapezi($ok) {
		global $globals;

		if ($globals->is_trapezi()) {
			$globals->trapezi->xeklidoma($ok);
		}
		else {
			@mysqli_rollback($globals->db);
		}
	}

	public static function klidose_pekti($pektis) {
		return(klidoma('pektis:' . $pektis));
	}

	public static function xeklidose_pekti($pektis, $ok) {
		xeklidoma('pektis:' . $pektis, $ok);
	}

	public static function set_params() {
		?>
		<script type="text/javascript">
			var parameters = {
				xronosMax:		<?php print XRONOS_DEDOMENA_MAX; ?>,
				dedomenaTic:		<?php print XRONOS_DEDOMENA_TIC; ?>,
				noAnswerMax:		<?php print XRONOS_NO_ANSWER_MAX; ?>,
				xronosPolivolo1:	<?php print XRONOS_POLIVOLO1; ?>,
				maxPolivolo1:		<?php print MAX_POLIVOLO1; ?>,
				xronosPolivolo2:	<?php print XRONOS_POLIVOLO2; ?>,
				maxPolivolo2:		<?php print MAX_POLIVOLO2; ?>
			};
		</script>
		<?php
	}

	public static function is_online($idle) {
		return($idle < XRONOS_PEKTIS_IDLE_MAX);
	}

	// Η μέθοδος "exodos" είναι από τις πλέον σημαντικές και σκοπό έχει
	// την έξοδο του τρέχοντος παίκτη από το τρέχον τραπέζι.

	public static function exodos() {
		global $globals;

		if ($globals->not_pektis()) { return(FALSE); }
		$pektis = $globals->pektis;
		$slogin = "'" . $globals->asfales($pektis->login) . "'";

		if ($globals->not_trapezi()) { return(FALSE); }
		$trapezi = $globals->trapezi;

		// Αν ο παίκτης συμμετέχει ως θεατής, τότε απλώς παύει να είναι θεατής.
		// Εδώ υπάρχει ένα πρόβλημα. Αν όλοι οι παίκτες έχουν γίνει θεατές και
		// κατόπιν κάνουν έξοδο από το τραπέζι, τότε θα παραμείνει το τραπέζι
		// σε κατάσταση "ζόμπι" (ενεργό, χωρίς παίκτες). Το τραπέζι κλείνει
		// μόνο όταν και τελευταίος παίκτης πραγματοποιήσει έξοδο είτε άμεσα
		// (πατώντας το κόκκινο κουμπάκι εξόδου), είτε έμμεσα (αποδεχόμενος
		// πρόσκληση από άλλο τραπέζι).

		if ($trapezi->is_theatis()) {
			$query = "DELETE FROM `theatis` WHERE `pektis` LIKE " . $slogin;
			$globals->sql_query($query);
			if (@mysqli_affected_rows($globals->db) != 1) {
				print 'Απέτυχε η έξοδος του παίκτη "' . $pektis->login .
					'" από το τραπέζι ' . $trapezi->kodikos .
					' ως θεατή';
				return(FALSE);
			}
			return(TRUE);
		}

		// Επιβεβαιώνουμε ότι ο παίκτης όντως συμμετέχει στο τραπέζι.
		$p = 'pektis' . $trapezi->thesi;
		if ($trapezi->$p != $pektis->login) {
			print 'Ο παίκτης "' . $pektis->login .
				'" δεν συμμετέχει στο τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Εκκενώνουμε τη θέση του παίκτη στο τραπέζι.
		$query = "UPDATE `trapezi` SET `pektis" . $trapezi->thesi .
			"` = NULL WHERE `kodikos` = " . $trapezi->kodikos;
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			print 'Απέτυχε η εκκένωση της θέσης του παίκτη "' . $pektis->login .
				'" στο τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Κρατάμε τη θέση στην οποία έπαιζε ο παίκτης στο τραπέζι.
		// Καλού κακού διαγράφουμε πρώτα τυχόν άλλη συμμετοχή αυτού
		// του τραπεζιού για την ίδια θέση ή για τον ίδιο παίκτη.
		$query = "DELETE FROM `simetoxi` WHERE (`trapezi` = " .
			$trapezi->kodikos . ") AND ((`pektis` LIKE " . $slogin .
			") OR (`thesi` = " . $trapezi->thesi . "))";
		$globals->sql_query($query);

		$query = "INSERT INTO `simetoxi` (`trapezi`, `thesi`, `pektis`) " .
			"VALUES (" . $trapezi->kodikos . ", " . $trapezi->thesi .
			", " . $slogin . ")";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			print 'Απέτυχε η εισαγωγή συμμετοχής του παίκτη "' +
				$pektis->login . '" για το τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Επιχειρούμε να κλείσουμε το τραπέζι, εφόσον όλες οι θέσεις
		// είναι πλέον κενές.
		$query = "UPDATE `trapezi` SET `telos` = NOW() WHERE (`kodikos` = " .
			$trapezi->kodikos .  ") AND (`pektis1` IS NULL) AND " .
			"(`pektis2` IS NULL) AND (`pektis3` IS NULL)";
		$globals->sql_query($query);

		// Αν δεν ενημερωθεί το τραπέζι σημαίνει ότι δεν έχουν ακόμη
		// εκκενωθεί όλες οι θέσεις, οπότε επιστρέφουμε.
		if (@mysqli_affected_rows($globals->db) != 1) {
			return(TRUE);
		}

		Trapezi::diagrafi($trapezi->kodikos);
		return(TRUE);
	}

	static public function energos_pektis() {
		global $globals;
		static $energos = NULL;
		static $etrexe_ts = 0;

		$tora_ts = time();
		if (($tora_ts - $etrexe_ts) > 1) {
			$etrexe_ts = $tora_ts;
			$energos = array();
			$query = "SELECT `login` FROM `pektis` " .
				"WHERE (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) < " .
				XRONOS_PEKTIS_IDLE_MAX;
			$result = $globals->sql_query($query);
			while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
				$energos[$row[0]] = TRUE;
			}
		}
		return($energos);
	}

	static public function rank($filo) {
		$rank = array();
		$n = 0;
		$rank["7"] = $n++;
		$rank["8"] = $n++;
		$rank["9"] = $n++;
		$rank["T"] = $n++;
		$rank["J"] = $n++;
		$rank["Q"] = $n++;
		$rank["K"] = $n++;
		$rank["A"] = $n++;
		return $rank[substr($filo, 1, 1)];
	}

	// Η μέθοδος "is_dilosi_paso" δέχεται ως παράμετρο δεδομένα
	// κίνησης τύπου "ΔΗΛΩΣΗ" και ελέγχει αν πρόκειται για δήλωση
	// πάσο. Οι δηλώσεις πάσο είναι της μορφής "PXA", όπου "X"
	// είναι το χρώμα και "A" η αξία της τρέχουσας αγοράς. Σημασία,
	// πάντως, εδώ, έχει ότι το πρώτο γράμμα είναι "P".

	static public function is_dilosi_paso($data) {
		return(substr($data, 0, 1) == "P");
	}

	static public function klise_sinedria() {
		global $globals;

		if ($globals->not_pektis()) { return; }

		$query = "INSERT INTO `sinedria_log` (`kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, `telos`) SELECT `kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, NOW() FROM `sinedria` WHERE `pektis` LIKE " .
			$globals->pektis->slogin;
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `sinedria` WHERE `pektis` LIKE " . $globals->pektis->slogin;
		$globals->sql_query($query);
	}
}
?>
