<?php
header('Content-type: text/plain; charset=utf-8');

require_once '../lib/standard.php';
set_globals();
$pinakas = Globals::perastike_check('pinakas');
$offset = Globals::perastike_check('offset');

switch ($pinakas) {
case 'pektis':
	backup_pektis($offset);
	break;
case 'sxesi':
	backup_sxesi($offset);
	break;
case 'minima':
	backup_minima($offset);
	break;
case 'trapezi':
	backup_trapezi($offset);
	break;
case 'dianomi':
	backup_dianomi($offset);
	break;
case 'kinisi':
	backup_kinisi($offset);
	break;
case 'sinedria':
	backup_sinedria($offset);
	break;
default:
	die($pinakas . ": invalid table name");
}

function backup_pektis($offset) {
	global $globals;

	$ola = count_ola("pektis");
	$fp = anixe_arxio("pektis", $offset);
	$limit = 100;
	$query = "SELECT `login`, `onoma`, `email`, `kapikia`, `katastasi`, `plati`, " .
		"`enalagi`, `paraskinio`, `poll`, `password`, `egrafi`, `superuser`, " .
		"`proxy`, `melos` " .
		"FROM `pektis` ORDER BY `login` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_sxesi($offset) {
	global $globals;

	$ola = count_ola("sxesi");
	$fp = anixe_arxio("sxesi", $offset);
	$limit = 100;
	$query = "SELECT `kodikos`, `pektis`, `sxetizomenos`, `status`, `dimiourgia` " .
		"FROM `sxesi` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_minima($offset) {
	global $globals;

	$ola = count_ola("minima");
	$fp = anixe_arxio("minima", $offset);
	$limit = 100;
	$query = "SELECT `kodikos`, `apostoleas`, `paraliptis`, `dimiourgia` " .
		"`katastasi`, `minima` " .
		"FROM `minima` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_trapezi($offset) {
	global $globals;

	$ola = count_ola("trapezi_log");
	$fp = anixe_arxio("trapezi", $offset);
	$limit = 100;
	$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` " .
		"FROM `trapezi_log` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_dianomi($offset) {
	global $globals;

	$ola = count_ola("dianomi_log");
	$fp = anixe_arxio("dianomi", $offset);
	$limit = 10000;
	$query = "SELECT `kodikos`, `trapezi`, `dealer`, `kasa1`, `metrita1`, " .
		"`kasa2`, `metrita2`, `kasa3`, `metrita3`, `enarxi`" .
		"FROM `dianomi_log` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_kinisi($offset) {
	global $globals;

	$ola = count_ola("kinisi_log");
	$fp = anixe_arxio("kinisi", $offset);
	$limit = 100000;
	$query = "SELECT `kodikos`, `dianomi`, `pektis`, `idos`, `data`, `pote` " .
		"FROM `kinisi_log` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_sinedria($offset) {
	global $globals;

	$ola = count_ola("trapezi");
	$fp = anixe_arxio("sinedria_log", $offset);
	$limit = 1000;
	$query = "SELECT `kodikos`, `pektis` " .
		"FROM `sinedria_log` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function count_ola($pinakas) {
	global $globals;

	$query = "SELECT COUNT(*) FROM `" . $pinakas . "`";
	$result = $globals->sql_query($query);
	$row = mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die($pinakas . ": cannot count");
	}
	mysqli_free_result($result);
	return($row[0]);
}

function print_data($offset, $limit, $count, $ola) {
	print $offset . ":" . $limit . ":" . $count . ":" . $ola . ":ok";
}

function anixe_arxio($arxio, $offset) {
	$fname = "../data/" . $arxio . ".txt";
	$fp = @fopen($fname, ($offset == 0 ? "w" : "a"));
	if ($fp) {
		return($fp);
	}

	die($arxio . ": cannot open file");
}

function write_grami($fp, $row) {
	$n = count($row);
	$x = $row[0];
	for ($i = 1; $i < $n; $i++) {
		$x .= "\t" . $row[$i];
	}
	$x .= "\n";
	fwrite($fp, $x);
}
