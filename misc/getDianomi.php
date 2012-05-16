<?php

ob_start();
header('Content-type: text/plain; charset=utf-8');

require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';

set_globals();
Prefadoros::set_pektis();
$offset = Globals::perastike("offset") ? $_REQUEST["offset"] : 0;

$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` FROM `trapezi` " .
	"WHERE (`pektis1` = BINARY " . $globals->pektis->slogin . ") OR " .
	"(`pektis2` = BINARY " . $globals->pektis->slogin . ") OR " .
	"(`pektis3` = BINARY " . $globals->pektis->slogin . ") " .
	"ORDER BY `kodikos` DESC LIMIT 1";
$result = $globals->sql_query($query);

$trapezi = NULL;
$thesi = NULL;
while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
	$trapezi = $row[0];
	for ($i = 1; $i <= 3; $i++) {
		if ($row[$i] == $globals->pektis->login) {
			$thesi = $i;
			break;
		}
	}
}

if (!isset($thesi)) {
	$globals->klise_fige();
}

$query = "SELECT `kodikos` FROM `dianomi` WHERE `trapezi` = " . $trapezi .
	" ORDER BY `kodikos` DESC LIMIT 2";
$result = $globals->sql_query($query);

$dianomi = array();
while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
	$dianomi[] = $row[0];
}

if ($offset >= count($dianomi)) {
	$globals->klise_fige();
}

$dianomi = $dianomi[$offset];

$query = "SELECT `pektis`, `idos`, `data` FROM `kinisi` WHERE (`dianomi` = " .
	$dianomi . ") AND (`idos` IN ('ΔΙΑΝΟΜΗ', 'ΑΓΟΡΑ'))";
$result = $globals->sql_query($query);

$idos = NULL;
$data = NULL;
while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
	$idos = $row[1];
	$data = $row[2];
	if (($row[1] == 'ΔΙΑΝΟΜΗ') && ($row[0] == $globals->pektis->login)) {
		break;
	}
}

if (!isset($idos)) {
	$globals->klise_fige();
}

switch ($idos) {
case 'ΑΓΟΡΑ':
	$data = agora_data($data);
	break;
case 'ΔΙΑΝΟΜΗ':
	$data = dianomi_data($data, $thesi);
	break;
default:
	$globals->klise_fige();
	break;
}

if (isset($data)) {
	print $data . ":OK";
}
$globals->klise_fige();

function agora_data($data) {
	$x = explode(":", $data);
	if (count($x) < 2) {
		return(NULL);
	}

	return($x[1]);
}

function dianomi_data($data, $thesi) {
	$x = explode(":", $data);
	if (count($x) < $thesi) {
		return(NULL);
	}

	return($x[$thesi]);
}

?>
