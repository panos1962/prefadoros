<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Sizitisi::cleanup_writing();
switch ($pk = Globals::perastike_check('pk')) {
case 'P':
	$trapezi = vres_trapezi();
	$sxolio = "@WP@";
	break;
case 'K':
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
