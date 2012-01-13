<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
$globals->time_dif = Globals::perastike_check('timeDif');

$dianomi_table = NULL;
$kinisi_table = NULL;
$dianomi = Globals::perastike_check('dianomi');
$query = "SELECT `kodikos` FROM `dianomi` WHERE `kodikos` = " .
	$globals->asfales($dianomi);
$result = $globals->sql_query($query);
while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
	$kinisi_table = 'kinisi';
}

if (!isset($found)) {
	$query = "SELECT `kodikos` FROM `dianomi_log` WHERE `kodikos` = " .
		$globals->asfales($dianomi);
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
		$kinisi_table = 'kinisi_log';
	}
}

print "{";

if (!isset($kinisi_table)) {
	print "error:'" . $dianomi . ": δεν βρέθηκε η διανομή'";
}
else {
	print "kinisi:[";
	select_kinisi($dianomi, $kinisi_table);
	print "],ok:true";
}

print "}";


function select_kinisi($dianomi, $kinisi_table) {
	global $globals;

	$koma = "";
	$query = "SELECT `kodikos`, `pektis`, `idos`, `data`, UNIX_TIMESTAMP(`pote`) AS `xronos` " .
		"FROM `" . $kinisi_table . "` WHERE `dianomi` = " .
		$dianomi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		kinisi_json($row, $koma);
		$koma = ",";
	}
}

function kinisi_json($row, &$koma) {
	global $globals;

	if ($row['idos'] == 'ΣΥΜΜΕΤΟΧΗ') {
		switch ($row['data']) {
		case 'ΜΑΖΙ':
			$row['data'] = 'M';
			break;
		case 'ΠΑΣΟ':
			$row['data'] = 'S';
			break;
		case 'ΠΑΙΖΩ':
			$row['data'] = 'P';
			break;
		case 'ΜΟΝΟΣ':
			$row['data'] = 'N';
			break;
		default:
			$row['data'] = '?';
			break;
		}
	}

	print $koma . "{k:" . $row['kodikos'] .
		",p:" . $row['pektis'] .
		",i:'" . $row['idos'] .
		"',d:'" . $row['data'] .
		"',x:'" . addslashes(Xronos::pote($row['xronos'],
			$globals->time_dif, "h:m:s", FALSE)) .
		"'}";
	$koma = ",";
}
?>
