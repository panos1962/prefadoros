<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
switch ($tk = Globals::perastike_check('tk')) {
case 'partida':		$trapezi = vres_trapezi(); break;
case 'kafenio':		$trapezi = "NULL"; break;
default:		die('Ακαθόριστο τραπέζι/καφενείο');
}

$sxolio = Globals::perastike_check('sxolio');
$query = "INSERT INTO `συζήτηση` (`παίκτης`, `τραπέζι`, `σχόλιο`) " .
	"VALUES (" . $globals->pektis->slogin . ", " . $trapezi . ", '" .
	$globals->asfales($sxolio) . "')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η εισαγωγή σχολίου');
}

function vres_trapezi() {
	global $globals;
	Prefadoros::trapezi_check();
	if ($globals->trapezi->is_theatis() &&
		(!$globals->trapezi->is_prosklisi())) {
			die('Δεν έχετε προσκληθεί στη συζήτηση αυτού του τραπεζιού');
	}
	return $globals->trapezi->kodikos;
}
