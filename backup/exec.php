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
case 'trapezi':
	backup_trapezi($offset);
	break;
case 'sinedria':
	backup_sinedria($offset);
	break;
default:
	die($pinakas . ": invalid table name");
}

function backup_pektis($offset) {
	global $globals;

	$query = "SELECT COUNT(*) FROM `pektis`";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die("pektis: cannot count");
	}
	@mysqli_free_result($result);
	$ola = $row[0];

	$fp = anixe_arxio("pektis");
	$limit = 100;
	$query = "SELECT `login`, `onoma`, `email` " .
		"FROM `pektis` ORDER BY `login` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_trapezi($offset) {
	global $globals;

	$query = "SELECT COUNT(*) FROM `trapezi_log`";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die("trapezi_log: cannot count");
	}
	@mysqli_free_result($result);
	$ola = $row[0];

	$fp = anixe_arxio("trapezi");
	$limit = 1000;
	$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3` " .
		"FROM `trapezi_log` ORDER BY `kodikos` LIMIT " . $offset . ", " . $limit;
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);

	print_data($offset, $limit, $count, $ola);
}

function backup_sinedria($offset) {
	global $globals;

	$query = "SELECT COUNT(*) FROM `sinedria_log`";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die("sinedria_log: cannot count");
	}
	@mysqli_free_result($result);
	$ola = $row[0];

	$fp = anixe_arxio("sinedria");
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

function anixe_arxio($arxio) {
	$fname = "../data/" . $arxio . ".txt";
	$fp = @fopen($fname, "w");
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
