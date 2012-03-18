<?php
class Theatis {
	public $trapezi;
	public $thesi;

	public function __construct($trapezi, $thesi) {
		$this->trapezi = $trapezi;
		$this->thesi = $thesi;
	}
}

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
				unset($_SESSION['ps_paraskinio']);
				unset($globals->pektis);
			}
		}
	}

	public static function pektis_check($login = FALSE, $forma = FALSE, $selida = FALSE) {
		global $globals;

		if (!$globals->is_pektis()) {
			self::set_pektis($login);
			if (!$globals->is_pektis()) {
				if ($forma) {
					?>
					<script type="text/javascript">
					var href = window.location.href;
					window.location = '<?php print $globals->server;
						?>account/login.php?aftonomo=yes&main=' +
						encodeURIComponent(href);
					</script>
					<?php
					if ($selida) {
						Page::close(FALSE);
					}
					$globals->klise_fige(0);
				}
				Globals::fatal('Ακαθόριστος παίκτης');
			}
		}

		if ($globals->pektis->proxy == 0) {
			$proxy_headers = array(   
				'HTTP_VIA',   
				'HTTP_X_FORWARDED_FOR',   
				'HTTP_FORWARDED_FOR',   
				'HTTP_X_FORWARDED',   
				'HTTP_FORWARDED',   
				'HTTP_CLIENT_IP',   
				'HTTP_FORWARDED_FOR_IP',   
				'VIA',   
				'X_FORWARDED_FOR',   
				'FORWARDED_FOR',   
				'X_FORWARDED',   
				'FORWARDED',   
				'CLIENT_IP',   
				'FORWARDED_FOR_IP',   
				'HTTP_PROXY_CONNECTION'   
			);
			foreach ($proxy_headers as $x){
				if (isset($_SERVER[$x])) {
					Globals::fatal('You are using a proxy!');
				}
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
			$query = "DELETE FROM `theatis` WHERE `pektis` = BINARY " .
				$globals->pektis->slogin;
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
			$trapezi->kodikos . ") AND ((`pektis` = BINARY " .
			$globals->pektis->slogin . ") OR (`thesi` = " .
			$trapezi->thesi . "))";
		$globals->sql_query($query);

		$query = "INSERT INTO `simetoxi` (`trapezi`, `thesi`, `pektis`) " .
			"VALUES (" . $trapezi->kodikos . ", " . $trapezi->thesi .
			", " . $globals->pektis->slogin . ")";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			print 'Απέτυχε η εισαγωγή συμμετοχής του παίκτη "' +
				$pektis->login . '" για το τραπέζι ' . $trapezi->kodikos;
			return(FALSE);
		}

		// Επιχειρούμε να κλείσουμε το τραπέζι, εφόσον όλες οι θέσεις
		// είναι πλέον κενές.
		$query = "UPDATE `trapezi` SET `telos` = NOW() WHERE (`kodikos` = " .
			$trapezi->kodikos .  ") AND (`telos` IS NULL) AND " .
			"(`pektis1` IS NULL) AND (`pektis2` IS NULL) AND " .
			"(`pektis3` IS NULL)";
		$globals->sql_query($query);

		// Αν δεν ενημερωθεί το τραπέζι σημαίνει ότι δεν έχουν ακόμη
		// εκκενωθεί όλες οι θέσεις, οπότε επιστρέφουμε.
		if (@mysqli_affected_rows($globals->db) != 1) {
			return(TRUE);
		}

		Trapezi::diagrafi($trapezi->kodikos);
		return(TRUE);
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα όλων των παικτών που
	// βρίσκονται online στο σύστημα. Online θεωρούνται οι παίκτες οι οποίοι
	// έχουν κάνει poll μέσα στο διάστημα ενός πλήρους, ήρεμου κύκλου ελέγχου
	// που καθορίζεται από τη σταθερά "XRONOS_PEKTIS_IDLE_MAX" (τάξη μεγέθους
	// μισού λεπτού και άνω).

	public static function energos_pektis() {
		global $globals;
		global $kiklos;
		static $etrexe_ts = 0.0;
		static $etrexe_kiklos = -1;
		static $energos = NULL;
		$errmsg = "Prefadoros::energos_pektis(): ";

		if ($etrexe_kiklos == $kiklos) {
			return($energos);
		}

		$tora_ts = microtime(TRUE);
		if (($tora_ts - $etrexe_ts) <= 1.2) {
			return($energos);
		}

		$now_ts = time();
		$last_hour_ts = $now_ts - ($now_ts % 3600);
		if ($now_ts - $last_hour_ts < 300) {
			$last_hour_ts -= 3600;
		}
		$query = "SELECT `login`, UNIX_TIMESTAMP(`poll`), `katastasi` FROM `pektis` " .
			"WHERE UNIX_TIMESTAMP(`poll`) > " . $last_hour_ts;
		$result = $globals->sql_query($query);

		$energos = array();
		$apasxolimenos = array();
		while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
			if (($now_ts - $row[1]) <= XRONOS_PEKTIS_IDLE_MAX) {
				$energos[$row[0]] = TRUE;
				switch ($row[2]) {
				case 'BUSY':
					$apasxolimenos[$row[0]] = TRUE;
					break;
				}
			}
		}

		$etrexe_ts = microtime(TRUE);
		$etrexe_kiklos = $kiklos;
		self::apasxolimenos($apasxolimenos);
		return($energos);
	}

	// Προστέθηκε αργότερα. Δέχεται ως παράμετρο ένα login name και επιστρέφει
	// true, αν ο παίκτης με το συγκεκριμένο login name είναι απασχολημένος.
	// Μπορεί, όμως, η παράμετρος που δέχεται να είναι και array δεικτοδοτημένο
	// με τα login names. Τέτοιου είδους κλήση έχουμε κατά την ανίχνευση των
	// ενεργών παικτών.

	public static function apasxolimenos($login) {
		static $apasxolimenos = NULL;

		// Αν η κλήση έγινε με array παικτών, τότε θέτουμε
		// το array και επιστρέφουμε.

		if (is_array($login)) {
			$apasxolimenos = $login;
			return;
		}

		return (isset($apasxolimenos) && array_key_exists($login, $apasxolimenos));
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα όλων των θεατών,
	// δεικτοδοτημένη με το login name των θεατών και με τιμή τον
	// κωδικό τραπεζιού και τη θέση θέασης.

	public static function lista_theaton() {
		global $globals;
		global $kiklos;
		static $stmnt = NULL;
		static $etrexe_ts = 0.0;
		static $etrexe_kiklos = -1;
		static $theatis = NULL;
		$errmsg = "Prefadoros::lista_theaton(): ";

		if ($etrexe_kiklos == $kiklos) {
			return($theatis);
		}

		$tora_ts = microtime(TRUE);
		if (($tora_ts - $etrexe_ts) <= 1.2) {
			return($theatis);
		}

		if ($stmnt == NULL) {
			$query = "SELECT `pektis`, `trapezi`, `thesi` FROM `theatis`";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->execute();
		$stmnt->bind_result($pektis, $trapezi, $thesi);

		$theatis = array();
		while ($stmnt->fetch()) {
			$theatis[$pektis] = new Theatis($trapezi, $thesi);
		}

		$etrexe_ts = microtime(TRUE);
		$etrexe_kiklos = $kiklos;
		return($theatis);
	}

	// Η παρακάτω (static) μέθοδος δημιουργεί λίστα όλων των παικτών
	// που φαίνονται να συμμετέχουν ως παίκτες σε ενεργά τραπέζια.

	public static function pezon_pektis() {
		global $globals;
		global $kiklos;
		static $stmnt = NULL;
		static $pezon = NULL;
		static $etrexe_ts = 0.0;
		static $etrexe_kiklos = -1;
		$errmsg = "Prefadoros::pezon_pektis(): ";

		if ($etrexe_kiklos == $kiklos) {
			return($pezon);
		}

		$tora_ts = microtime(TRUE);
		if (($tora_ts - $etrexe_ts) <= 1.5) {
			return($pezon);
		}

		if ($stmnt == NULL) {
			$query = "SELECT `pektis1`, `pektis2`, `pektis3` " .
				"FROM `trapezi` WHERE `telos` IS NULL";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->execute();
		$stmnt->bind_result($pektis1, $pektis2, $pektis3);

		$pezon = array();
		while ($stmnt->fetch()) {
			if (!empty($pektis1)) { $pezon[$pektis1] = TRUE; }
			if (!empty($pektis2)) { $pezon[$pektis2] = TRUE; }
			if (!empty($pektis3)) { $pezon[$pektis3] = TRUE; }
		}

		$etrexe_kiklos = $kiklos;
		$etrexe_ts = microtime(TRUE);
		return($pezon);
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

	static public function klise_sinedria($base_dir = "") {
		global $globals;

		if ($globals->not_pektis()) { return; }

		$query = "INSERT INTO `sinedria_log` (`kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, `telos`) SELECT `kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, NOW() FROM `sinedria` " .
			"WHERE `pektis` = BINARY " . $globals->pektis->slogin;
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `sinedria` WHERE `pektis` = BINARY " . $globals->pektis->slogin;
		$globals->sql_query($query);

		// Μια στις 50 φορές επιχειρούμε να κλείσουμε συνεδρίες παικτών
		// που δεν έχουν επαφή με το πρόγραμμα για αρκετή ώρα.
		if (mt_rand(1, 50) == 10) {
			self::klise_palies_sinedries($base_dir);
		}
	}

	private static function klise_palies_sinedries($base_dir) {
		global $globals;

		$anenergos = "SELECT `login` FROM `pektis` WHERE " .
			"(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) > 300";
		$query = "INSERT INTO `sinedria_log` (`kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, `telos`) SELECT `kodikos`, `pektis`, `ip`, " .
			"`dimiourgia`, `enimerosi`, NOW() FROM `sinedria` WHERE `pektis` IN (" .
			$anenergos . ")";
		@mysqli_query($globals->db, $query);

		$query = "DELETE FROM `sinedria` WHERE `pektis` IN (" . $anenergos . ")";
		$globals->sql_query($query);

		$result = $globals->sql_query($anenergos);
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			$data_file = $base_dir . "dedomena/" . $row[0] . ".php";
			if (is_file($data_file)) {
				@unlink($data_file);
			}
		}
	}
}
?>
