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
		print '<div style="width: 60%; min-width: 12cm; border-style: double; ' .
			'boder-width: 3px; border-color: #990000; padding: 0.4cm; ' .
			'text-align: center; font-size: 0.4cm; margin-top: 2.0cm; ' .
			'margin-left: 1.0cm;">' .
			$msg . '</div>';
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
		<link rel="stylesheet" type="text/css" href="lib/standard.css" />
		<script type="text/javascript">
			//<![CDATA[
			globals = {};
			globals.server = '<?php print $globals->server; ?>';
			globals.timeDif = <?php print time(); ?>;
			//]]>
		</script>
		<script type="text/javascript" src="lib/standard.js"></script>
		<?php
	}

	public static function body() {
		?>
		</head>
		<body>
		<?php
	}

	public static function close() {
		?>
		</body>
		</html>
		<?php
	}
}

?>
