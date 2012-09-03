<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once 'photo.php';

define('MAX_USERS', 70);
// Ακολουθεί το κόστος διανομής σε λεπτά.
define('KOSTOS_DIANOMIS', 0.1);

unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
Page::data();
set_globals();

Globals::perastike_check('login');
Globals::perastike_check('password');

// Ο παίκτης μπορεί να δώσει στο login το όνομά του είτε με μικρά,
// είτε με κεφαλαία γράμματα, αλλά το πρόγραμμα θα κρατήσει στο
// session το όνομα όπως αυτό έχει δοθεί κατά την εγγραφή.

$query = "SELECT `login`, `paraskinio`, `superuser` FROM `pektis` " .
	"WHERE (`login` = BINARY '" . $globals->asfales($_REQUEST['login']) .
	"') AND (`password` = BINARY '" . $globals->asfales(sha1($_REQUEST['password'])) . "')";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if (!$row) {
	$globals->klise_fige("Access denied");
}
@mysqli_free_result($result);

check_adiaxorito($_REQUEST['login'], $row[2]);
check_pektis_photo($_REQUEST['login']);
Prefadoros::set_trapezi_dirty();

$_SESSION['ps_login'] = $row[0];
$_SESSION['ps_paraskinio'] = $row[1];
$globals->klise_fige();

function check_adiaxorito($login, $super_user) {
	global $globals;

	$pektes = count(Prefadoros::energos_pektis());
	if ($pektes < 1) { return; }
	if ($super_user == "YES") { return; }

	$poso = 0;
	$query = "SELECT `poso` FROM `pliromi` WHERE `pektis` = BINARY '" .
		$globals->asfales($login) . "'";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$poso += $row[0];
	}

	if ($poso <= 0) { adiaxorito($pektes); }

	// Αποτιμώνται οι διανομές που έχουν ήδη παιχτεί συνολικά.
	$dianomes = dianomes($_REQUEST['login']);
	$osop = $dianomes * KOSTOS_DIANOMIS;
	if ($osop > $poso) { adiaxorito($pektes, $dianomes, $osop, $poso); }
}

function adiaxorito($pektes, $dianomes = 0, $osop = 0, $poso = 0) {
	global $globals;

	$globals->klise_fige("ADIAXORITO@" . $pektes . "@" . MAX_USERS . "@" .
		$dianomes . "@" . $osop . "@" . $poso);
}

function dianomes($pektis) {
	global $globals;

	$dianomes = 0;
	$fname = "../stats/rank.txt";
	$fp = fopen($fname, "r");
	if (!$fp) { return($dianomes); }

	while ($buf = Globals::get_line($fp)) {
		$x = explode("\t", $buf);
		if (count($x) < 4) { continue; }
		if ($x[0] != $pektis) { continue; }

		$dianomes = $x[2];
		break;
	}

	@fclose($fp);
	return($dianomes);
}
?>
