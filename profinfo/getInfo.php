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

bathmologia($pektis, $dianomes, $moros, $rank);
$globals->klise_fige($onoma . "\t" . $dianomes . "\t" . $moros . "\t" .
	$rank . "\t" . $status . "\t" . $mine . "\t" . $enim . "\t");

function bathmologia($pektis, &$dianomes, &$moros, &$rank) {
	$dianomes = NULL;
	$moros = NULL;
	$rank = NULL;

	$fname = "../stats/rank.txt";
	$fp = @fopen($fname, "r");
	if (!$fp) {
		return;
	}

	while ($buf = Globals::get_line($fp)) {
		$x = explode("\t", $buf);
		if (count($x) < 4) {
			continue;
		}
		if ($x[0] != $pektis) {
			continue;
		}

		$dianomes = $x[2];
		$moros = $x[4];
		if (count($x) >= 5) {
			$rank = $x[5];
		}
		break;
	}

	@fclose($fp);
}
?>
