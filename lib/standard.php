<?php
// μέγιστος χρόνος διαδικασίας διαδοχικών κύκλων ανίχνευσης νέων δεδομένων σε seconds
define('XRONOS_DEDOMENA_MAX', 4);

// νεκρός χρόνος μεταξύ δύο διαδοχικών ανιχνεύσεων σε microseconds
define('XRONOS_DEDOMENA_TIC', 700000);

// μέγιστο διάστημα polling μέχρι να θεωρηθεί ο παίκτης offline.
define('XRONOS_PEKTIS_IDLE_MAX', (XRONOS_DEDOMENA_MAX * 1.5));

if (isset($no_session)) {
	$_SESSION = array();
	$_SESSION['ps_login'] = $_REQUEST['login'];
}
else {
	Session::init();
}
global $globals;
unset($globals);

class Globals {
	public $server;
	public $db;
	public $administrator;
	public $pektis;
	public $trapezi;
	public $dianomi;

	public function __construct() {
		unset($this->server);
		unset($this->db);
		unset($this->administrator);
		unset($this->pektis);
		unset($this->trapezi);
		unset($this->dianomi);
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

	public function is_trapezi() {
		return(isset($this->trapezi));
	}

	public function trapezi_check() {
		if (!$this->is_trapezi()) {
			self::fatal('ακαθόριστο τραπέζι');
		}
	}

	public function is_dianomi() {
		return(isset($this->dianomi));
	}

	public function dianomi_check() {
		if (!$this->is_dianomi()) {
			self::fatal('ακαθόριστη διανομή');
		}
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

	public function sql_query($query, $msg = 'SQL error') {
		$result = @mysqli_query($this->db, $query);
		if ($result) {
			return($result);
		}

		print $msg . ': ' . @mysqli_error($this->db);
		die(1);
	}

	public function klidoma($tag, $timeout = 2) {
		$query = "SELECT GET_LOCK('" . $this->asfales($tag) . "', " . $timeout . ")";
		$result = @mysqli_query($this->db, $query);
		if (!$result) {
			return(FALSE);
		}

		$row = @mysqli_fetch_array($result, MYSQLI_NUM);
		if (!$row) {
			return(FALSE);
		}
		@mysqli_free_result($result);

		if ($row[0] != 1) {
			return(FALSE);
		}

		@mysqli_autocommit($this->db, FALSE);
		return(TRUE);
	}

	public function xeklidoma($tag, $ok) {
		if ($ok) {
			@mysqli_commit($this->db);
		}
		else {
			@mysqli_rollback($this->db);
		}

		$query = "DO RELEASE_LOCK('" . $this->asfales($tag) . "')";
		@mysqli_query($this->db, $query);
	}

	public static function fatal($msg = 'unknown') {
		print 'ERROR: ' . $msg;
		die(1);
	}

	public static function get_line($fh) {
		$line = fgets($fh);
		if ($line) {
			return(preg_replace("/[\r\n].*/", '', $line));
		}
		return(FALSE);
	}

	public static function put_line($fh, $s) {
		return(fwrite($fh, $s . "\n"));
	}
}

class Session {
	public static function init() {
		// 24 * 7 * 3600 = 604800
		ini_set('session.gc_maxlifetime', '604800');
		session_set_cookie_params(604800);
		session_start();
		mb_internal_encoding('UTF-8');
		mb_regex_encoding('UTF-8');
	}

	public static function is_set($tag) {
		if ((!isset($_SESSION)) || (!is_array($_SESSION))) {
			Globals::fatal('_SESSION: not set or not an array');
		}

		return (array_key_exists($tag, $_SESSION));
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
		break;
	case 'tessa.gen6dns.net':
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/~panos/new';
		$dbname = 'panos_prefadoros';
		$dbuser = 'panos_prefadoros';
		$dbpassword = $dpass;
		break;
	case 'www.prefadoros.gr':
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/new';
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
	default:
		Globals::fatal($_SERVER['SERVER_NAME'] . ': unknown server');	
	}

	if (Session::is_set('ps_administrator')) {
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
		<meta name="description" content="<?php print $titlos; ?>" />
		<title><?php print $titlos; ?></title>
		<?php self::stylesheet('lib/standard'); ?>
		<script type="text/javascript">
			//<![CDATA[
			var globals = {};
			var pektis = null;
			globals.server = '<?php print $globals->server; ?>';
			globals.timeDif = <?php print time(); ?>;
			pektis = {};
			<?php
			if (Session::is_set('ps_login')) {
				?>
				pektis.login = '<?php print $_SESSION['ps_login']; ?>';
				<?php
			}
			if (Session::is_set('ps_whlt') &&
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
		if (!$diafimisi) {
			return;
		}
		?>
		<div id="diafimisi" class="diafimisiArea">
			<?php
			self::apokripsi('diafimisi');
			print $diafimisi;
			?>
		</div>
		<?php
	}

	public static function motd() {
		global $globals;

		$motd1 = @file_get_contents($globals->server . 'motd_all.html');
		if ($globals->is_pektis()) {
			$motd2 = @file_get_contents($globals->server . 'motd.html');
		}
		else {
			$motd2 = FALSE;
		}

		if (!($motd1 || $motd2)) {
			return;
		}
		?>
		<div id="motd" class="motdArea">
			<div class="motdInnerArea">
				<?php
				self::apokripsi('motd');
				if ($motd1) {
					print $motd1;
				}

				if ($motd2) {
					if ($motd1) {
						print '<hr class="motdLine" />';
					}
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

	public static function epikefalida($pedi = FALSE) {
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
					?>
				</div>
			</td>
			<td class="tbldbg">
				<div class="toolbarCenter">
					<?php self::centerTB(); ?>
				</div>
			</td>
			<td class="tbldbg" style="width: 49%;">
			</td>
			</tr></table>
		</div>
		<?php
	}

	protected static function leftTB() {
		global $globals;

		if ($globals->is_pektis()) {
			?>
			[&nbsp;<a href="<?php print $globals->server; ?>index.php"
				class="data">Καφενείο</a>&nbsp;]
			<?php
		}
		?>
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>help/index.php?pedi=yes" class="data">Οδηγίες</a>&nbsp;]
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>faq/index.php?pedi=yes" class="data">FAQ</a>&nbsp;]
		<?php
		if ($globals->is_pektis()) {
			?>
			[&nbsp;<a class="data" target="_blank" href="<?php
				print $globals->server; ?>pm/index.php?pedi=yes" >PM</a>&nbsp;]
			<?php
		}
	}

	protected static function centerTB($titlos = 'Πρεφαδόρος') {
		?>
		<div class="dialogos" id="dialogos"></div>
		<span class="data">
			<?php print $titlos; ?>
		</span>
		<?php
	}

	protected static function rightTB() {
		global $globals;
		?>
		<span id="monitor"></span>
		<?php
		if ($globals->is_pektis()) {
			?>
			<div id="monitorDots"></div>
			<div id="monitorCount"></div>
			<a target="_blank" href="<?php
				print $globals->server; ?>account/signup.php?modify"
				class="data login" title="Account settings"><?php
					print $globals->pektis->login; ?></a>
			<?php
			self::logout_section();
		}
		else {
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

	public static function fyi() {
		?>
		<div id="mainFyi" class="fyi mainFyi">
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
		<a href="http://www.gnu.org/licenses/agpl.html" target="_blank"
			title="GNU Affero General Public License"><img
			src="<?php print $globals->server; ?>images/agplv3.png"
			alt="GNU Affero General Public License" height="24" /></a>
		<a href="http://validator.w3.org/check?uri=referer"
			title="Validate XHTML for this page"><img
			src="<?php print $globals->server; ?>images/valid-xhtml10.png"
			alt="Valid XHTML 1.0!" height="24" /></a>
		<a href="http://jigsaw.w3.org/css-validator/check/referer?profile=css3"
			title="Validate CSS for this page"><img
			src="<?php print $globals->server; ?>images/vcss.gif"
			alt="Valid CSS!" height="24" /></a>
		<?php
		// self::statCounter();
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
	}

	protected static function rightRB() {
		global $globals;
		?>
		<span class="data" style="font-style: italic; white-space: nowrap;">
			&copy; Panos I. Papadopoulos <span style="font-style: normal;">[<a
				href="mailto:<?php print 'panos1962@gmail.com'; ?>"><img
				src="<?php print $globals->server; ?>images/email.png"
				style="width: 0.6cm; height: 0.5cm; margin-bottom: -0.15cm;"
					alt="" /></a>]</span> 2011&ndash;
		</span>
		<?php
	}

	public static function close($ribbon = TRUE) {
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
		<div style="float: right;">
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

?>
