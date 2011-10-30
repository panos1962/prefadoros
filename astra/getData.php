<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();
$globals->time_dif = Globals::perastike_check('timeDif');

Prefadoros::pektis_check();

print "{";

$query = "";
$query .= parse_partida();

print "partida:[";
select_partida($query);
print "],ok:true}";

function parse_partida() {
	global $globals;

	$query = "";
	if (!Globals::perastike('partida')) { return $query; }
	$partida = trim($_REQUEST['partida']);
	if ($partida == "") { return; }

	$tmima = explode(",", $partida);
	$n = count($tmima);
	for ($i = 0; $i < $n; $i++) {
		$tmima[$i] = trim($tmima[$i]);
		if ($tmima[$i] == "") { continue; }

		if ($query != "") { $query .= " OR"; }
		else { $query .= " AND ("; }

		$query .= " (`kodikos` ";
		if (preg_match("/^[0-9]+$/", $tmima[$i])) {
			$query .= "= " . $tmima[$i] . ")";
		}
		elseif (preg_match("/^[0-9]+\\-[0-9]+$/", $tmima[$i])) {
			$ipotmima = explode("-", $tmima[$i]);
			$query .= "BETWEEN " . $ipotmima[0] . " AND " . $ipotmima[1] . ")";
		}
		elseif (preg_match("/^[0-9]+\\-$/", $tmima[$i])) {
			$ipotmima = explode("-", $tmima[$i]);
			$query .= ">= " . $ipotmima[0] . ")";
		}
		else {
			lathos_kritiria($partida . ": λανθασμένα κριτήρια παρτίδας");
		}
	}

	if ($query != "") { $query .= ")"; }
	return $query;
}

function select_partida($sql) {
	global $globals;
	if ($sql == "") { return; }

	$columns = "`kodikos`, `pektis1`, `pektis2`, `pektis3`, `kasa`, ";

	$koma = "";
	$query = "SELECT " . $columns . "UNIX_TIMESTAMP(`telos`) AS `xronos` " .
		"FROM `trapezi_log` WHERE 1" . $sql . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		partida_json($row, $koma, '_log');
	}

	$query = "SELECT " . $columns . "UNIX_TIMESTAMP(`stisimo`) AS `xronos` " .
		"FROM `trapezi` WHERE 1" . $sql . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		partida_json($row, $koma);
	}
}

function partida_json($row, &$koma, $log = '') {
	global $globals;

	doune_lavin($row['kodikos'], $row['kasa'], $log, $kapikia);
	print $koma . "{t:" . $row['kodikos'] .
		",p1:'" . $row['pektis1'] .
		"',k1:" . $kapikia[1] .
		",p2:'" . $row['pektis2'] .
		"',k2:" . $kapikia[2] .
		",p3:'" . $row['pektis3'] .
		"',k3:" . $kapikia[3] .
		",x:'" . addslashes(Xronos::pote($row['xronos'], $globals->time_dif)) .
		"'}";
	$koma = ",";
}

function doune_lavin($trapezi, $kasa, $log, &$kapikia) {
	global $globals;

	$kasa *= 10;
	$kapikia = array(0, -$kasa, -$kasa, -$kasa);
	$kasa *= 3;

	$query = "SELECT * FROM `dianomi" . $log . "` WHERE `trapezi` = " . $trapezi;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$kasa -= $row['kasa1'] + $row['kasa2'] + $row['kasa3'];
		$kapikia[1] += $row['metrita1'] + $row['kasa1'];
		$kapikia[2] += $row['metrita2'] + $row['kasa2'];
		$kapikia[3] += $row['metrita3'] + $row['kasa3'];
	}

	$x = $kasa / 3;
	$kapikia[2] = floor($kapikia[2] + $x);
	$kapikia[3] = floor($kapikia[3] + $x);
	$kapikia[1] = -($kapikia[2] + $kapikia[3]);
}

function lathos_kritiria($s) {
	die("error:'" . addslashes($s) . "}");
}
?>
