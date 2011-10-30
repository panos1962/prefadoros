<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
$globals->time_dif = Globals::perastike_check('timeDif');

$dianomi_table = NULL;
$kinisi_table = NULL;
$trapezi = Globals::perastike_check('trapezi');
$query = "SELECT `kodikos` FROM `trapezi` WHERE `kodikos` = " .
	$globals->asfales($trapezi);
$result = $globals->sql_query($query);
while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
	$dianomi_table = 'dianomi';
	$kinisi_table = 'kinisi';
}

if (!isset($found)) {
	$query = "SELECT `kodikos` FROM `trapezi` WHERE `kodikos` = " .
		$globals->asfales($trapezi);
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
		$dianomi_table = 'dianomi_log';
		$kinisi_table = 'kinisi_log';
	}
}

print "{";

if (!isset($dianomi_table)) {
	print "error:'" . $trapezi . ": δεν βρέθηκε το τραπέζι";
}
else {
	print "dianomi:[";
	select_dianomi($trapezi, $dianomi_table, $kinisi_table);
	print "],ok:true";
}

print "}";


function select_dianomi($trapezi, $dianomi_table, $kinisi_table) {
	global $globals;

	$koma = "";
	$query = "SELECT `kasa1`, `metrita1`, `kasa2`, `metrita2`, " .
		"`kasa3`, `metrita3` FROM `" . $dianomi_table .
		"` WHERE `trapezi` = " . $trapezi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		dianomi_json($row, $kinisi_table, $koma);
	}
}

function partida_json($row, $kinisi_table, &$koma) {
	global $globals;

	print $koma . "{d:" . $row['kodikos'] .
		",k1:" . $row['kasa1'] .
		",m1:" . $row['metrita1'] .
		",k2:" . $row['kasa2'] .
		",m2:" . $row['metrita2'] .
		",k3:" . $row['kasa3'] .
		",m3:" . $row['metrita3'];
	agora_json($row['kodikos'], $kinisi_table);
	print "'}";
	$koma = ",";
}

function agora_data($dianomi, $kinisi_table) {
	global $globals;

	$query = "SELECT * FROM `" . $kinisi_table . "` WHERE `dianomi` = " .
		$dianomi . " AND `idos` ΙΝ ('ΑΓΟΡΑ', 'ΔΗΛΩΣΗ', 'ΣΥΜΜΕΤΟΧΗ') ".
		"ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$x = 0;
	}
}
?>
