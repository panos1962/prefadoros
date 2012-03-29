<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();
$pektis = Globals::perastike_check("pektis");
$kimeno = Globals::perastike_check("kimeno");
$apektis = "'" . $globals->asfales($pektis) . "'";

$query = "DELETE FROM `profinfo` WHERE (`sxoliastis` = BINARY " .
	$globals->pektis->slogin . ") AND (`pektis` = BINARY " . $apektis . ")";
$globals->sql_query($query);

$query = "INSERT INTO `profinfo` (`pektis`, `sxoliastis`, `kimeno`) VALUES (" .
	$apektis . ", " . $globals->pektis->slogin . ", '" . $globals->asfales($kimeno) . "')";
$globals->sql_query($query);

$globals->klise_fige();
?>
