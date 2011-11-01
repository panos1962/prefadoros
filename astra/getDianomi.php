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
	$query = "SELECT `kodikos` FROM `trapezi_log` WHERE `kodikos` = " .
		$globals->asfales($trapezi);
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
		$dianomi_table = 'dianomi_log';
		$kinisi_table = 'kinisi_log';
	}
}

print "{";

if (!isset($dianomi_table)) {
	print "error:'" . $trapezi . ": δεν βρέθηκε το τραπέζι'";
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
	$query = "SELECT * FROM `" . $dianomi_table . "` WHERE `trapezi` = " .
		$trapezi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		dianomi_json($row, $kinisi_table, $koma);
	}
}

function dianomi_json($row, $kinisi_table, &$koma) {
	global $globals;

	print $koma . "{d:" . $row['kodikos'] .
		",l:" . $row['dealer'] .
		",k1:" . $row['kasa1'] .
		",m1:" . $row['metrita1'] .
		",k2:" . $row['kasa2'] .
		",m2:" . $row['metrita2'] .
		",k3:" . $row['kasa3'] .
		",m3:" . $row['metrita3'];
	agora_json($row['kodikos'], $kinisi_table);
	print "}";
	$koma = ",";
}

function agora_json($dianomi, $kinisi_table) {
	global $globals;

	$agora = NULL;
	$dilosi = array('', '', '', '');
	$simetoxi = array('', '', '', '');
	$query = "SELECT * FROM `" . $kinisi_table . "` WHERE (`dianomi` = " .
		$dianomi . ") AND (`idos` IN ('ΑΓΟΡΑ', 'ΔΗΛΩΣΗ', 'ΣΥΜΜΕΤΟΧΗ')) ".
		"ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		switch ($row['idos']) {
		case 'ΑΓΟΡΑ':
			$tzogadoros = $row['pektis'];
			$agora = $row['data'];
			break;
		case 'ΔΗΛΩΣΗ':
			if (substr($row['data'], 0, 1) != "P") {
				$dilosi[$row['pektis']] = $row['data'];
			}
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			$simetoxi[$row['pektis']] = $row['data'];
			break;
		}
	}

	if (!isset($agora)) {
		return;
	}

	$mazi = 0;
	for ($i = 1; $i <= 3; $i++) {
		switch ($simetoxi[$i]) {
		case 'ΜΑΖΙ':
			$mazi = $i;
			$simetoxi[$i] = 'M';
			break;
		case 'ΠΑΣΟ':
			$simetoxi[$i] = 'S';
			break;
		case 'ΠΑΙΖΩ':
			$simetoxi[$i] = 'P';
			break;
		case 'ΜΟΝΟΣ':
			$simetoxi[$i] = 'N';
			break;
		default:
			$simetoxi[$i] = '';
			break;
		}
	}

	if ($mazi > 0) {
		for ($i = 1; $i <= 3; $i++) {
			if ($simetoxi[$i] == 'S') {
				$simetoxi[$i] = 'V';
			}
		}
	}

	$tmima = explode(":", $agora);
	$agora = $tmima[0];
	print ",t:" . $tzogadoros;
	print ",a:'" . $agora . "'";
	print ",o:[";
	$koma = "";
	for ($i = 0; $i <= 3; $i++) {
		print $koma . "'" . addslashes($dilosi[$i]) . "'";
		$koma = ",";
	}
	print "],s:[";
	$koma = "";
	for ($i = 0; $i <= 3; $i++) {
		print $koma . "'" . $simetoxi[$i] . "'";
		$koma = ",";
	}
	print "]";
}
?>
