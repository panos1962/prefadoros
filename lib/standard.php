<?php

Session::init();
global $globals;

class Globals {
	public $server;
	public $db;
	public $administrator;
	public $pektis;
	public $trapezi;
	public $dianomi;
	public $kinisi;

	public function __construct() {
		unset($this->server);
		unset($this->db);
		unset($this->administrator);
		unset($this->pektis);
		unset($this->trapezi);
		unset($this->dianomi);
		unset($this->kinisi);
	}

	public function is_administrator() {
		return(isset($this->administrator));
	}

	public function check_administrator() {
		if (!$this->is_administrator()) {
			Globals::fatal('required administrator permission');
		}
	}

	public function is_pektis() {
		return(isset($this->pektis));
	}

	public function is_trapezi() {
		return(isset($this->trapezi));
	}

	public function is_dianomi() {
		return(isset($this->dianomi));
	}

	public function is_kinisi() {
		return(isset($this->kinisi));
	}

	public static function perastike($key) {
		return(isset($_REQUEST) && is_array($_REQUEST) &&
			array_key_exists($key, $_REQUEST));
	}

	public static function fatal($msg) {
		print 'ERROR: ' . $msg;
		die(1);
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

function set_globals($database = TRUE) {
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
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/~panos/';
		$dbname = 'panos_prefadoros';
		$dbuser = 'panos_prefadoros';
		$dbpassword = $dpass;
		break;
	case 'www.prefadoros.gr':
		$globals->server = 'http://' . $_SERVER['SERVER_NAME'] . '/';
		$dbname = 'panos_prefadoros';
		$dbuser = 'panos_prefadoros';
		$dbpassword = $dpass;
		break;
	case 'www.perloc.info':
		$globals->server = 'http://www.perloc.info/prefadoros/';
		$dbname = 'panos62_prefadoros';
		$dbuser = 'panos62_pineza';
		$dbpassword = $dpass;
		break;
	default:
		Globals::fatal($_SERVER['SERVER_NAME'] . ': unknown server');	
	}

	if ($database) {
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

	if (Session::is_set('ps_administrator')) {
		$globals->administrator = TRUE;
	}

$globals->pektis = 'panos';
/*
	if (Session::is_set('ps_login')) {
		$globals->pektis = new Pektis($_SESSION['ps_login']);
		if (!isset($globals->pektis->login)) {
			unset($_SESSION['ps_login']);
			unset($globals->pektis);
		}
	}

	if ($globals->is_pektis()) {
		$globals->trapezi = new Trapezi($globals->pektis->login);
		if (isset($globals->trapezi->kodikos)) {
			$globals->trapezi->fetch_dianomi();
			$globals->trapezi->fetch_kinisi();
		}
		else {
			unset($globals->trapezi);
		}
	}
*/
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
			globals = {};
			globals.server = '<?php print $globals->server; ?>';
			globals.timeDif = <?php print time(); ?>;
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
		?>
		<div id="diafimisi" class="diafimisiArea">
			<?php self::apokripsi('diafimisi'); ?>
			Διαφήμιση<br />
			Διαφήμιση<br />
			Διαφήμιση<br />
			Διαφήμιση<br />
		</div>
		<?php
	}

	public static function motd() {
		?>
		<div id="motd" class="motdArea">
			<div class="motdInnerArea">
				<?php self::apokripsi('motd'); ?>
				Message of the day<br />
				Message of the day<br />
				Message of the day<br />
				Message of the day<br />
				Message of the day<br />
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

	public static function epikefalida($titlos = 'Πρεφαδόρος') {
		?>
		<div id="toolbar" class="toolbarArea">
			<div class="toolbarCenter">
				<?php self::centerTB($titlos); ?>
			</div>
		</div>
		<?php
	}

	protected static function leftTB() {
		?>
		<span class="data">
			LeftTB
		</span>
		<?php
	}

	protected static function centerTB($titlos = 'Πρεφαδόρος') {
		?>
		<div class="mitra" id="mitra"></div>
		<span class="data">
			<?php print $titlos; ?>
		</span>
		<?php
	}

	protected static function rightTB() {
		?>
		<span class="data">
			rightTB
		</span>
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
			?>copyright/index.php" class="data">Copyright</a>&nbsp;]
		[&nbsp;<a target="_blank" href="<?php print $globals->server;
			?>adia/index.php" class="data nobr">Άδεια&nbsp;χρήσης</a>&nbsp;]
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
		[&nbsp;<a target="_blank" href="<?php
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
			<img class="apokripsiIcon" src="<?php
				print $globals->server; ?>images/Xgrey.png"
				title="Close" onclick="sviseNode(getelid('<?php print $id; ?>'));" />
		</div>
		<?php
	}

	public static function json() {
		header('Content-Type: application/json; charset=UTF-8');
	}

	public static function data() {
		header('Content-type: text/plain; charset=utf-8');
	}

	public static function check_administrator() {
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
