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
		elseif (Session::is_set('ps_login')) {
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

	public static function set_trapezi($all = FALSE) {
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

		if ($all) {
			$globals->trapezi->fetch_dianomi();
			$globals->trapezi->fetch_kinisi();
		}

		return(TRUE);
	}

	public static function trapezi_check($all = FALSE) {
		global $globals;

		if (!$globals->is_trapezi()) {
			self::set_trapezi($all);
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
		$query = "SELECT * FROM `διανομή` WHERE `τραπέζι` = " .
			$globals->trapezi->kodikos . " ORDER BY `κωδικός`";
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
			$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " . $slogin;
			$globals->sql_query($query);
			if (mysqli_affected_rows($globals->db) != 1) {
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
		$query = "UPDATE `τραπέζι` SET `παίκτης" . $trapezi->thesi .
			"` = NULL WHERE `κωδικός` = " . $trapezi->kodikos;
		$globals->sql_query($query);
		if (mysqli_affected_rows($globals->db) != 1) {
			print 'Απέτυχε η εκκένωση της θέσης του παίκτη "' . $pektis->login .
				'" στο τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Κρατάμε τη θέση στην οποία έπαιζε ο παίκτης στο τραπέζι.
		// Καλού κακού διαγράφουμε πρώτα τυχόν άλλη συμμετοχή αυτού
		// του τραπεζιού για την ίδια θέση ή για τον ίδιο παίκτη.
		$query = "DELETE FROM `συμμετοχή` WHERE (`τραπέζι` = " .
			$trapezi->kodikos . ") AND ((`παίκτης` LIKE " . $slogin .
			") OR (`θέση` = " . $trapezi->thesi . "))";
		$globals->sql_query($query);

		$query = "INSERT INTO `συμμετοχή` (`τραπέζι`, `θέση`, `παίκτης`) " .
			"VALUES (" . $trapezi->kodikos . ", " . $trapezi->thesi .
			", " . $slogin . ")";
		$globals->sql_query($query);
		if (mysqli_affected_rows($globals->db) != 1) {
			print 'Απέτυχε η εισαγωγή συμμετοχής του παίκτη "' +
				$pektis->login . '" για το τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Επιχειρούμε να κλείσουμε το τραπέζι, εφόσον όλες οι θέσεις
		// είναι πλέον κενές.
		$query = "UPDATE `τραπέζι` SET `τέλος` = NOW() WHERE (`κωδικός` = " .
			$trapezi->kodikos .  ") AND (`παίκτης1` IS NULL) AND " .
			"(`παίκτης2` IS NULL) AND (`παίκτης3` IS NULL)";
		$globals->sql_query($query);

		// Αν δεν ενημερωθεί το τραπέζι σημαίνει ότι δεν έχουν ακόμη
		// εκκενωθεί όλες οι θέσεις, οπότε επιστρέφουμε.
		if (mysqli_affected_rows($globals->db) != 1) {
			return(TRUE);
		}

		// Το τραπέζι μόλις έχει κλείσει, οπότε επαναφέρω τους τελευταίους
		// συμμετέχοντες παίκτες.
		$query = "SELECT * FROM `συμμετοχή` WHERE `τραπέζι` = " . $trapezi->kodikos;
		$result = $globals->sql_query($query);
		if (!$result) {
			print 'Απέτυχε το μάζεμα συμμετοχών για το τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		$pektis1 = 'NULL';
		$pektis2 = 'NULL';
		$pektis3 = 'NULL';
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$p = "pektis" . $row['θέση'];
			$$p = "'" . $globals->asfales($row['παίκτης']) . "'";
		}

		// Αν έχουμε μαζέψει έστω και μια εγγραφή συμμετοχής, προχωρούμε στην
		// επανατοποθέτηση των παικτών.
		if (($pektis1 != 'NULL') || ($pektis2 != 'NULL') || ($pektis3 != 'NULL')) {
			$query = "UPDATE `τραπέζι` SET `παίκτης1` = " . $pektis1 .
				", `παίκτης2` = " . $pektis2 . ", " .  "`παίκτης3` = " .
				$pektis3 . " WHERE `κωδικός` = " . $trapezi->kodikos;
			$globals->sql_query($query);
			if (mysqli_affected_rows($globals->db) != 1) {
				print 'Απέτυχε η επανατοποθέτηση των παικτών στο τραπέζι ' .
					$trapezi->kodikos;
				return(FALSE);
			}
		}

		// Το τραπέζι έχει κλείσει και έχει γίνει τυχόν επανατοποθέτηση των
		// τελευταίων παικτών, οπότε διαγράφουμε όλες τις περιφερειακές
		// εγγραφές που αφορούν στο τραπέζι (συμμετοχές, θεατές, προσκλήσεις).

		$query = "DELETE FROM `συμμετοχή` WHERE `τραπέζι` = " . $trapezi->kodikos;
		$globals->sql_query($query);

		$query = "DELETE FROM `θεατής` WHERE `τραπέζι` = " . $trapezi->kodikos;
		$globals->sql_query($query);

		$query = "DELETE FROM `πρόσκληση` WHERE `τραπέζι` = " . $trapezi->kodikos;
		$globals->sql_query($query);
		return(TRUE);
	}

	static public function energos_pektis() {
		global $globals;

		$energos = array();
		$query = "SELECT `login` FROM `παίκτης` WHERE " .
			"(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) < " .
			XRONOS_PEKTIS_IDLE_MAX;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			$energos[$row[0]] = TRUE;
		}
		return($energos);
	}
}
?>
