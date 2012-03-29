<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();
$pektis = Globals::perastike_check("pektis");
$apektis = "'" . $globals->asfales($pektis) . "'";

$onoma = "";
$query = "SELECT `onoma` FROM `pektis` WHERE `login` = BINARY " . $apektis;
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	$onoma = $row[0];
}
@mysqli_free_result($result);

$status = "";
$query = "SELECT `status` FROM `sxesi` WHERE (`pektis` = BINARY " .
	$globals->pektis->slogin . ") AND (`sxetizomenos` = BINARY " . $apektis . ")";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	$status = $row[0];
}
@mysqli_free_result($result);

$mine = "";
$query = "SELECT `kimeno` FROM `profinfo` WHERE (`sxoliastis` = BINARY " .
	$globals->pektis->slogin . ") AND (`pektis` = BINARY " . $apektis . ")";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	$mine = $row[0];
}
@mysqli_free_result($result);

$enim = "";
if ($globals->pektis->login != $pektis) {
	$query = "SELECT `kimeno` FROM `profinfo` WHERE (`sxoliastis` = BINARY " .
		$apektis . ") AND (`pektis` = BINARY " . $apektis . ")";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if ($row) {
		$enim = $row[0];
	}
	@mysqli_free_result($result);
}

$globals->klise_fige($onoma . "\t" . $status . "\t" . $mine . "\t" . $enim . "\t");
?>
