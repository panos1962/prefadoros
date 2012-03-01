<?php
// μέγιστος χρόνος διαδικασίας διαδοχικών κύκλων ανίχνευσης νέων δεδομένων (seconds)
// define('XRONOS_DEDOMENA_MAX', 40);
define('XRONOS_DEDOMENA_MAX', 40);

// νεκρός χρόνος μεταξύ δύο διαδοχικών ανιχνεύσεων (microseconds)
define('XRONOS_DEDOMENA_TIC', 800000);
define('XRONOS_DEDOMENA_TIC2', 1000000);
define('XRONOS_DEDOMENA_TIC3', 1500000);
define('XRONOS_DEDOMENA_TIC4', 2500000);

// ελάχιστο διάστημα μεταξύ polling timestamps (seconds)
define('XRONOS_POLL_GRANULE', 30);

// μέγιστο διάστημα polling μέχρι να θεωρηθεί ο παίκτης offline σε (seconds)
define('XRONOS_PEKTIS_IDLE_MAX', (XRONOS_DEDOMENA_MAX + (2 * XRONOS_POLL_GRANULE) + 10));

// μέγιστο επιτρεπτό διάστημα μεταξύ απαντήσεων από τον server (milliseconds)
define('XRONOS_NO_ANSWER_MAX', ((XRONOS_DEDOMENA_MAX + 5) * 1000));

// διάστημα στο οποίο ελέγχεται το φαινόμενο πολυβόλου (milliseconds)
define('XRONOS_POLIVOLO1', 2000);

// μέγιστος αριθμός δεκτών απαντήσεων σε διάστημα πολυβόλου
define('MAX_POLIVOLO1', 20);

// Γίνεται παρόμοιος έλεγχος και για ευρύτερο διάστημα.
define('XRONOS_POLIVOLO2', 20000);
define('MAX_POLIVOLO2', 30);

define('FUNCHAT_SERVER', 'http://www.pineza.info/prefa/funchatImages/');
define('MY_EMAIL_ADDRESS', 'panos1962@gmail.com');
define('SYSTEM_ACCOUNT', 'www.prefadoros.gr');
define('DEFAULT_PARASKINIO', 'standard.gif');

if (isset($no_session)) {
	$_SESSION = array();
	if (isset($_REQUEST) && is_array($_REQUEST) &&
		array_key_exists('login', $_REQUEST)) {
		$_SESSION['ps_login'] = $_REQUEST['login'];
	}
}
else {
	// 24 * 7 * 3600 = 604800
	ini_set('session.gc_maxlifetime', '604800');
	session_set_cookie_params(604800);
	session_start();
}
mb_internal_encoding('UTF-8');
mb_regex_encoding('UTF-8');
global $globals;
unset($globals);

class Globals {
	public $klista;
	public $server;
	public $db;
	public $administrator;
	public $phpmyadmin;
	public $time_dif;
	public $pektis;
	public $trapezi;
	public $dianomi;
	public $kinisi;

	public function __construct() {
		unset($this->klista);
		unset($this->server);
		unset($this->db);
		unset($this->administrator);
		unset($this->phpmyadmin);
		unset($this->time_dif);
		unset($this->pektis);
		unset($this->trapezi);
		unset($this->dianomi);
		unset($this->kinisi);
	}

	public function is_administrator() {
		return(isset($this->administrator));
	}

	public function administrator_check() {
		if (!$this->is_administrator()) {
			self::fatal('required administrator permission');
		}
	}

	public function is_pektis() {
		return(isset($this->pektis));
	}

	public function not_pektis() {
		return(!$this->is_pektis());
	}

	public function is_trapezi() {
		return(isset($this->trapezi));
	}

	public function not_trapezi() {
		return(!$this->is_trapezi());
	}

	public function trapezi_check() {
		if (!$this->is_trapezi()) {
			self::fatal('ακαθόριστο τραπέζι');
		}
	}

	public function is_dianomi() {
		return(isset($this->dianomi) && (count($this->dianomi) > 0));
	}

	public function not_dianomi() {
		return(!$this->is_dianomi());
	}

	public function is_kinisi() {
		return(isset($this->kinisi) && (count($this->kinsi) > 0));
	}

	public static function perastike($key) {
		return(isset($_REQUEST) && is_array($_REQUEST) &&
			array_key_exists($key, $_REQUEST));
	}

	public static function perastike_check($key, $msg = NULL) {
		if (self::perastike($key)) {
			return($_REQUEST[$key]);
		}

		print isset($msg) ? $msg : $key . ': δεν περάστηκε παράμετρος';
		die(1);
	}

	public static function session_set($tag) {
		if ((!isset($_SESSION)) || (!is_array($_SESSION))) {
			Globals::fatal('_SESSION: not set or not an array');
		}

		return (array_key_exists($tag, $_SESSION));
	}

	public static function email_check($email, $msg = NULL) {
		if (!@filter_var($email, FILTER_VALIDATE_EMAIL)) {
			print isset($msg) ? $msg : $email . ': invalid email address';
			die(1);
		}
	}

	public function asfales($s) {
		if (get_magic_quotes_gpc()) {
			$s = stripslashes($s);
		}

		if (isset($this->db)) {
			return(@mysqli_real_escape_string($this->db, $s));
		}

		return($s);
	}

	// Η μέθοδος "akirosi_script" χρησιμοποιείται για να ακυρώσει τυχόν
	// ενσωματωμένο javascript κώδικα σε μηνύματα και συζητήσεις, και
	// το επιτυγχάνει εισάγοντας χαρακτήρα μηδενικού πλάτους πριν τη
	// λέξη script.

	public static function akirosi_script($s) {
		return(preg_replace("/script/i", "&#8203;script", $s));
	}

	public function sql_query($query, $msg = 'SQL error') {
		$result = @mysqli_query($this->db, $query);
		if ($result) { return($result); }

		print $msg . ': ' . $query . ': ' . @mysqli_error($this->db);
		die(1);
	}

	public static function fatal($msg = 'unknown') {
		print 'ERROR: ' . $msg;
		die(1);
	}

	// Επιχειρεί να διαβάσει μια γραμμή από αρχείο. Αν τα καταφέρει,
	// επιστρέφει τη γραμμή, αλλιώς FALSE.

	public static function get_line($fh) {
		$line = fgets($fh);
		if ($line) {
			return(preg_replace("/[\r\n].*/", '', $line));
		}
		return(FALSE);
	}

	// Επιχειρεί να διαβάσει μια γραμμή από αρχείο. Αν τα καταφέρει
	// και η γραμμή δεν είναι "@END@", επιστρέφει τη γραμμή, αλλιώς
	// επιστρέφει FALSE.
	//
	// Η function είναι βολική για διάβασμα δεδομένων που τελειώνουν
	// με γραμμή "@END@".

	public static function get_line_end($fh) {
		if (($line = self::get_line($fh)) === FALSE) {
			return(FALSE);
		}

		if ($line === '@END@') {
			return(FALSE);
		}

		return($line);
	}

	public static function put_line($fh, $s) {
		return(fwrite($fh, $s . "\n"));
	}

	public function klidoma($tag, $timeout = 2) {
		$query = "SELECT GET_LOCK('" . $this->asfales($tag) . "', " . $timeout . ")";
		$result = @mysqli_query($this->db, $query);
		if (!$result) { return(FALSE); }

		$row = @mysqli_fetch_array($result, MYSQLI_NUM);
		if (!$row) { return(FALSE); }

		@mysqli_free_result($result);
		if ($row[0] != 1) { return(FALSE); }

		return(TRUE);
	}

	public function klise_fige($msg = 0) {
		if (isset($this->db)) {
			@mysqli_kill($this->db, @mysqli_thread_id($this->db));
			@mysqli_close($this->db);
		}
		die($msg);
	}

	function xeklidoma($tag, $commit = NULL) {
		if (isset($commit)) {
			if ($commit) {
				@mysqli_commit($this->db);
			}
			else {
				@mysqli_rollback($this->db);
			}
		}

		$query = "DO RELEASE_LOCK('" . $this->asfales($tag) . "')";
		@mysqli_query($this->db, $query);
	}
}

function set_globals($anonima = FALSE) {
	global $globals;

	if (isset($globals)) {
		Globals::fatal('globals object redefinition');
	}

	$globals = new Globals();

	if ((!isset($_SERVER)) || (!is_array($_SERVER))) {
		Globals::fatal('_SERVER: not set or not an array');
	}

	$dbhost = 'localhost';
	$dpass = preg_replace('/[^a-zA-Z0-9]/', '', '@p#a@$r*%09##o c$$#@!t@..:');
	switch ($_SERVER['SERVER_NAME']) {
	case '127.0.0.1':
		$globals->server = 'http://127.0.0.1/prefadoros/';
		$dbname = 'prefadoros';
		$dbuser = 'root';
		$dbpassword = '';
		$globals->phpmyadmin = 'http://127.0.0.1/phpmyadmin/index.php?db=prefadoros';
		break;
	case 'www.prefadoros.gr':
	case '178.21.171.4':
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/';
		$dbname = 'prefadoros';
		$dbuser = 'prefadoros';
		$dbpassword = $dpass;
		$globals->phpmyadmin = 'http://178.21.171.4/phpym/index.php?db=prefadoros';
		break;
	case 'tessa.gen6dns.net':
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/~panos/';
		$dbname = 'panos_prefadoros';
		$dbuser = 'panos_prefadoros';
		$dbpassword = $dpass;
		break;
	case 'www.pineza.info':
		$globals->server = 'http://www.pineza.info/prefadoros/';
		$dbname = 'panos62_prefadoros';
		$dbuser = 'panos62_pineza';
		$dbpassword = $dpass;
		break;
	case '78.46.77.106':
		$globals->server = 'http://78.46.77.106/';
		$dbname = 'prefadoros';
		$dbuser = 'prefadoros';
		$dbpassword = $dpass;
		break;
	default:
		Globals::fatal($_SERVER['SERVER_NAME'] . ': unknown server');	
	}

	if (Globals::session_set('ps_administrator')) {
		$globals->administrator = TRUE;
	}

	if ($anonima) {
		return;
	}

	$globals->db = @mysqli_connect($dbhost, $dbuser, $dbpassword);
	if (!$globals->db) {
		Globals::fatal('database connection failed (' .
			@mysqli_connect_error() . ')');
	}

	@mysqli_set_charset($globals->db, 'UTF8');
	if (!@mysqli_select_db($globals->db, $dbname)) {
		Globals::fatal('cannot open database (' . $dbname . ')');
	}
}

class Page {
	public static function stylesheet($css) {
		global $globals;
		?>
		<link rel="stylesheet" type="text/css" href="<?php
			print $globals->server . $css; ?>.css" />
		<?php
	}

	public static function javascript($script) {
		global $globals;
		?>
		<script type="text/javascript" src="<?php
			print $globals->server . $script; ?>.js"></script>
		<?php
	}

	public static function head($titlos = 'Πρεφαδόρος') {
		global $globals;

		header('Content-Type: text/html; charset=UTF-8');
		?>
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
				"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="description" content="Παίξτε πρέφα on-line!" />
		<meta name="keywords" content="πρέφα,πρεφαδόρος,πρεφα,πρεφαδορος,prefa,prefadoros" />
		<meta name="author" content="Panos Papadopoulos" />
		<meta name="copyright" content="Copyright by Panos Papadopoulos. All Rights Reserved." />

		<link rel="icon" type="image/png" href="<?php
			print $globals->server; ?>images/controlPanel/kitapi.png" />
		<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php
			print $globals->server; ?>favicon.ico" />
		<title><?php print $titlos; ?></title>
		<?php self::stylesheet('lib/standard'); ?>
		<script type="text/javascript">
		//<![CDATA[
		var globals = {};
		globals.server = '<?php print $globals->server; ?>';
		globals.timeDif = <?php print time(); ?>;
		globals.administrator = <?php print $globals->is_administrator() ? 'true' : 'false'; ?>;
		globals.paraskinio = '<?php print (Globals::session_set('ps_paraskinio') ?
			$_SESSION['ps_paraskinio'] : DEFAULT_PARASKINIO); ?>';
		var pektis = {};
		<?php
		if (Globals::session_set('ps_login')) {
			?>
			pektis.login = '<?php print $_SESSION['ps_login']; ?>';
			<?php
		}
		if (Globals::session_set('ps_whlt') &&
			preg_match('/^[0-9]+:[0-9]+:[0-9]+:[0-9]+$/', $_SESSION['ps_whlt'])) {
				?>
				globals.funchatWhlt = '<?php print $_SESSION['ps_whlt']; ?>';
				<?php
		}
		?>
		//]]>
		</script>
		<?php self::javascript('lib/standard'); ?>
		<?php
	}

	public static function body() {
		?>
		</head>
		<body>
		<?php
	}

	public static function diafimisi() {
		global $globals;

		$diafimisi = @file_get_contents($globals->server . 'diafimisi.html');
		if (!$diafimisi) { return; }
		?>
		<div id="diafimisi" class="diafimisiArea"
			onmouseover="getelid('apokripsidiafimisi').style.visibility='visible';"
			onmouseout="getelid('apokripsidiafimisi').style.visibility='hidden';">
			<?php self::apokripsi('diafimisi'); ?>
			<script type="text/javascript">
			//<![CDATA[
			setTimeout(function() {
				var x = getelid('diafimisi');
				if (notSet(x)) { return; }
				x.innerHTML += '<?php print str_replace
					(array("\r\n", "\r", "\n", "\t"), '', $diafimisi); ?>';
			}, 500);
			//]]>
			</script>
		</div>
		<?php
	}

	public static function motd() {
		global $globals;

		$motd1 = "motd_all.html";
		if (@file_exists($motd1) && @is_readable($motd1)) {
			$motd1 = @file_get_contents($motd1);
		}
		else {
			$motd1 = FALSE;
		}

		if ($globals->is_pektis()) {
			$motd2 = "motd/" . $globals->pektis->login . ".html";
			$motd2 = (@file_exists($motd2) && @is_readable($motd2)) ?
				@file_get_contents($motd2) : FALSE;
		}
		else {
			$motd2 = FALSE;
		}

		if (!($motd1 || $motd2)) { return; }
		?>
		<div id="motd" class="motdArea"
			onmouseover="getelid('apokripsimotd').style.visibility='visible';"
			onmouseout="getelid('apokripsimotd').style.visibility='hidden';">
			<div class="motdInnerArea">
				<?php
				self::apokripsi('motd');
				if ($motd1) { print $motd1; }
				if ($motd2) {
					if ($motd1) { print '<hr class="motdLine" />'; }
					print $motd2;
				}
				?>
			</div>
		</div>
		<?php
	}

	public static function toolbar() {
		?>
		<div id="toolbar" class="toolbarArea">
			<table class="tbldbg" style="width: 100%;"><tr>
			<td class="tbldbg" style="width: 49%;">
				<div class="toolbarLeft">
					<?php self::leftTB(); ?>
				</div>
			</td>
			<td class="tbldbg">
				<div class="toolbarCenter">
					<?php self::centerTB(); ?>
				</div>
			</td>
			<td class="tbldbg" style="width: 49%;">
				<div class="toolbarRight">
					<?php self::rightTB(); ?>
				</div>
			</td>
			</tr></table>
		</div>
		<?php
	}

	public static function epikefalida($pedi = FALSE, $more = NULL) {
		global $globals;
		?>
		<div id="toolbar" class="toolbarArea">
			<table class="tbldbg" style="width: 100%;"><tr>
			<td class="tbldbg" style="width: 49%;">
				<div class="toolbarLeft">
					<?php
					if ($pedi) {
						?>
						[&nbsp;<a href="<?php
							print $globals->server; ?>index.php"
							onclick="window.self.close(); return false"
							class="data">Κλείσιμο</a>&nbsp;]
						<?php
					}
					if (isset($more)) {
						print $more;
					}
					?>
				</div>
			</td>
			<td class="tbldbg">
				<div class="toolbarCenter">
					<?php self::centerTB(); ?>
				</div>
			</td>
			<td class="tbldbg" style="width: 49%;">
				<div class="toolbarRight">
					<?php
					if ($globals->is_pektis()) {
						?><span class="data login"><?php
							print $globals->pektis->login;
						?></span><?php
					}
					?>
				</div>
			</td>
			</tr></table>
		</div>
		<?php
	}

	protected static function leftTB() {
		global $globals;
		?>
		<div style="display: inline-block; width: 11.0cm;">
		<?php
		if ($globals->is_pektis()) {
			?> <span id="partidaKafenio"></span> <?php
		}
		?>
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>help/index.php?pedi=yes" title="Οδηγίες" class="data">Οδηγίες</a>&nbsp;]
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>faq/index.php?pedi=yes" class="data"
			title="Συνηθισμένες ερωτήσεις">FAQ</a>&nbsp;]
		<?php
		if ($globals->is_pektis()) {
			?>
			[<a target="_blank" href="<?php print $globals->server;
				?>astra/index.php?pedi=yes" class="data"
				title="Αρχείο παρτίδων">Αρχείο</a>]
			[&nbsp;<a id="permesLink" class="data" target="_blank" href="<?php
				print $globals->server; ?>permes/index.php?pedi=yes"
				title="Προσωπικά μηνύματα">PM</a>&nbsp;]
			<?php
		}
		?>
		</div>
		<?php
	}

	protected static function centerTB($titlos = 'Πρεφαδόρος') {
		?>
		<span class="data">
			<?php print $titlos; ?>
		</span>
		<?php
	}

	protected static function rightTB() {
		global $globals;

		if ($globals->is_pektis()) {
			?>
			<a target="_blank" href="<?php
				print $globals->server; ?>account/signup.php?modify"
				class="data login" title="Στοιχεία λογαριασμού"
				style="max-width: 5.4cm; overflow: hidden;<?php
					if ($globals->pektis->login == SYSTEM_ACCOUNT) {
						print " color: #FF3333;";
					}
					?>"><?php print $globals->pektis->login; ?></a>
			<?php
			self::logout_section();
		}
		elseif (!isset($globals->klista)) {
			self::signup_section();
			self::login_section();
		}
	}

	protected static function signup_section() {
		global $globals;
		?>
		[&nbsp;<a href="<?php print $globals->server;
			?>account/signup.php" class="data">Εγγραφή</a>&nbsp;]
		<?php
	}

	protected static function login_section() {
		global $globals;
		?>
		[&nbsp;<a href="<?php print $globals->server;
			?>account/login.php" class="data">Είσοδος</a>&nbsp;]
		<?php
	}

	protected static function logout_section() {
		global $globals;
		?>
		[&nbsp;<a href="<?php print $globals->server; ?>/index.php"
			onclick="return logout();" class="data">Έξοδος</a>&nbsp;]
		<?php
	}

	public static function fyi($style = "") {
		?>
		<div id="mainFyi" class="fyi mainFyi" style="<?php print $style; ?>">
			&nbsp;
		</div>
		<?php
	}

	public static function ribbon() {
		?>
		<div id="ribbon" class="ribbonArea">
			<table class="tbldbg" style="width: 100%;"><tr>
			<td class="tbldbg" style="width: 30%; vertical-align: top;">
				<div class="ribbonLeft">
					<?php self::leftRB(); ?>
				</div>
			</td>
			<td class="tbldbg" style="vertical-align: top;">
				<div class="ribbonCenter">
					<?php self::centerRB(); ?>
				</div>
			</td>
			<td class="tbldbg" style="width: 30%; vertical-align: top;">
				<div class="ribbonRight">
					<?php self::rightRB(); ?>
				</div>
			</td>
			</tr></table>
		</div>
		<?php
	}

	protected static function leftRB() {
		global $globals;
		?>
		<?php
		/*
		<a href="http://validator.w3.org/check?uri=referer"
			title="Validate XHTML for this page" target="_blank"><img
			src="<?php print $globals->server; ?>images/valid-xhtml10.png"
			alt="Valid XHTML 1.0!" height="24" /></a>
		<a href="http://jigsaw.w3.org/css-validator/check/referer?profile=css3"
			title="Validate CSS for this page"><img
			src="<?php print $globals->server; ?>images/vcss.gif"
			alt="Valid CSS!" height="24" /></a>
		*/
		?>
		<a href="http://www.gnu.org/licenses/agpl.html" target="_blank"
			title="GNU Affero General Public License"><img
			src="<?php print $globals->server; ?>images/agplv3.png"
			alt="GNU Affero General Public License" height="24" /></a>
		<a href="http://www.hellasbridge.org" target="_blank"
			title="Ελληνική Ομοσπονδία Μπριτζ"><img class="leftRibbonIcon"
			src="<?php print $globals->server; ?>images/eom.png"
			alt="http://www.bridgebase.com" height="24" /></a>
		<a href="http://www.bridgebase.com" target="_blank" title="Bridge Base Online"><img
			src="<?php print $globals->server; ?>images/bbo.png"
			alt="http://www.bridgebase.com" height="24" /></a>
		<div style="margin-bottom: 0.1cm;"></div>
		<a href="https://twitter.com/prefadorosTT" target="_blank"><img
			src="<?php print $globals->server; ?>images/twitter.png"
			alt="Ο «Πρεφαδόρος» στο twitter" height="19" /></a>
		<?php
		if ($globals->is_pektis()) {
			?>
			<div title="Για τις ανάγκες του server…" style="display: inline-block;">
			<form target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post">
			<input type="hidden" name="cmd" value="_s-xclick">
			<input type="hidden" name="hosted_button_id" value="7UGXKWGRM5TXU">
			<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
				border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
			<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
				width="1" height="1" >
			</form>
			</div>
			<?php
		}
		?>
		<iframe src="<?php print "//www.facebook.com/plugins/like.php?" .
			"href=http%3A%2F%2Fwww.prefadoros.gr&amp;send=false&amp;" .
			"layout=button_count&amp;width=90&amp;show_faces=false&amp;" .
			"action=like&amp;colorscheme=light&amp;font&amp;height=35";
			?>" scrolling="no" frameborder="0" style="<?php
			print "margin-left: 1px; border: none; overflow: hidden; width: 90px; height: 20px;";
			?>"></iframe>
		<?php
	}

	protected static function centerRB() {
		global $globals;
		?>
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>copyright/index.php?pedi=yes" class="data">Copyright</a>&nbsp;]
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>adia/index.php?pedi=yes" class="data nobr">Άδεια&nbsp;χρήσης</a>&nbsp;]
		<?php
		if ($globals->is_administrator()) {
			$class = 'data administrator';
			$page = 'index';
		}
		else {
			$class = 'data';
			$page = 'login';
		}
		?>
		[&nbsp;<a id="administratorLabel" target="_blank" href="<?php
			print $globals->server; ?>administrator/<?php
			print $page; ?>.php" class="<?php
			print $class; ?>">Administrator</a>&nbsp;]
		<br />
		[&nbsp;<a target="_blank" href="http://www.prefablog.wordpress.com"
			class="data">Ιστολόγιο</a>&nbsp;]
		[&nbsp;<a target="_blank" href="http://prefadoros.forumgreek.com"
			class="data">Φόρουμ</a>&nbsp;]
		<?php
		if ($globals->is_pektis()) {
			?>
			[&nbsp;<a target="_blank" href="<?php print $globals->server;
				?>dorea/index.php?pedi=yes">Δωρεές</a>&nbsp;]
			<?php
		}
	}

	protected static function rightRB() {
		global $globals;
		?>
		<div class="data" style="font-style: italic; white-space: nowrap;">
			&copy; Panos I. Papadopoulos <span style="font-style: normal;">[<a
				title="Send mail to &quot;<?php print MY_EMAIL_ADDRESS; ?>&quot;"
				href="mailto:<?php print MY_EMAIL_ADDRESS; ?>"><img
				src="<?php print $globals->server; ?>images/email.png"
				style="width: 0.6cm; height: 0.5cm; margin-bottom: -0.15cm;"
					alt="" /></a>]</span> 2011&ndash;
		</div>
		<div id="monitorArea" class="monitor"></div>
		<?php
	}

	public static function close($ribbon = TRUE) {
		global $globals;

		if ($ribbon) {
			self::ribbon();
		}
		?>
		</body>
		</html>
		<?php
	}

	public static function apokripsi($id) {
		global $globals;
		?>
		<div id="apokripsi<?php print $id; ?>" class="apokripsi">
			<img class="pinezaIcon" title="Καρφίτσωμα" src="<?php
				print $globals->server; ?>images/pineza.png" alt=""
				onclick="karfitsoma('<?php print $id; ?>', this);" />
			<img class="apokripsiIcon" title="Απόκρυψη" src="<?php
				print $globals->server; ?>images/Xgrey.png" alt=""
				onclick="sviseNode(getelid('<?php print $id; ?>'));" />
		</div>
		<?php
	}

	public static function json() {
		header('Content-Type: application/json; charset=UTF-8');
	}

	public static function data() {
		header('Content-type: text/plain; charset=utf-8');
	}

	public static function administrator_check() {
		global $globals;
		if (!$globals->is_administrator()) {
			?>
			<meta http-equiv="refresh" content="0; url=<?php
				print $globals->server; ?>administrator/login.php" />
			<?php
		}
	}
}

class Xronos {
	public static function pote($ts, $offset = 0, $format = 'd/m/Y, h:i', $prin = TRUE) {
		$ts += $offset;
		if ($prin) {
			$dif = time() - $ts;
			if ($dif < 60) {
				return 'τώρα';
			}

			if ($dif < 3600) {
				$x = round($dif / 60);
				return 'πριν ' . $x . ' λεπτ' . ($x < 2 ? 'ό' : 'ά');
			}

			if ($dif < 86400) {
				$x = round($dif / 3600);
				return 'πριν ' . $x . ' ώρ' . ($x < 2 ? 'α' : 'ες');
			}
		}

		return date($format, $ts);
	}
}
?>
