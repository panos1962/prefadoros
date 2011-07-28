<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
global $slogin;
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

Globals::perastike_check('pion');
$pion = "'" . $globals->asfales($_REQUEST['pion']) . "'";

$trapezi = vres_to_trapezi($slogin);
if (!$trapezi) {
	die('Ακαθόριστο τραπέζι για πρόσκληση');
}

$query = "INSERT INTO `πρόσκληση` (`ποιος`, `ποιον`, `τραπέζι`) " .
	"VALUES (" . $slogin . ", " . $pion .  ", " .
	$globals->asfales($trapezi) . ")";
@mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η αποστολή πρόσκλησης στον παίκτη "' .
		$_REQUEST['pion'] . '" για το τραπέζι ' . $trapezi);
}

function vres_to_trapezi($slogin) {
	global $globals;
	global $login;
	Prefadoros::set_trapezi();
	if (!$globals->is_trapezi()) {
		return(FALSE);
	}

	if ($globals->trapezi->simetoxi == 'ΠΑΙΚΤΗΣ') {
		return($globals->trapezi->kodikos);
	}

	$query = "SELECT * FROM `πρόσκληση` WHERE `ποιον` LIKE " . $slogin .
		" AND `τραπέζι` = " . $globals->trapezi->kodikos;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result);
	if (!$row) {
		return(FALSE);
	}

	return($globals->trapezi->kodikos);
}

?>
