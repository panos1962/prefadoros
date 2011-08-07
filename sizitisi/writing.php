<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$query = "DELETE FROM `συζήτηση` WHERE (`παίκτης` LIKE " .
	$globals->pektis->slogin . ") AND (`σχόλιο` REGEXP '^@W[PK]@$')";
$globals->sql_query($query);
switch ($pk = Globals::perastike_check('pk')) {
case 'partida':
	$trapezi = vres_trapezi();
	$sxolio = "@WP@";
	break;
case 'kafenio':
	$trapezi = "NULL";
	$sxolio = "@WK@";
	break;
default:
	die(0);
}

$query = "INSERT INTO `συζήτηση` (`παίκτης`, `τραπέζι`, `σχόλιο`) " .
	"VALUES (" . $globals->pektis->slogin . ", " . $trapezi . ", '" .
	$globals->asfales($sxolio) . "')";
$globals->sql_query($query);

function vres_trapezi() {
	global $globals;
	Prefadoros::trapezi_check();
	if ($globals->trapezi->is_theatis() && (!$globals->trapezi->is_prosklisi())) {
		die(0);
	}
	return $globals->trapezi->kodikos;
}
