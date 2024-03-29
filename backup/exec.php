<?php
die(0);
global $no_session;
$no_session = TRUE;

require_once '../lib/standard.php';
Page::data();
set_globals();
$pinakas = Globals::perastike_check('pinakas');

set_time_limit(0);
switch ($pinakas) {
case 'pektis':
	backup_pektis();
	break;
case 'sxesi':
	backup_sxesi();
	break;
case 'minima':
	backup_minima();
	break;
case 'trapezi':
	backup_trapezi();
	break;
case 'dianomi':
	backup_dianomi();
	break;
case 'kinisi':
	backup_kinisi();
	break;
case 'sinedria':
	backup_sinedria();
	break;
default:
	die($pinakas . ": invalid table name");
}

function backup_pektis() {
	global $globals;

	$fp = anixe_arxio("pektis");
	$query = "SELECT `login`, `onoma`, `email`, `kapikia`, `katastasi`, `plati`, " .
		"`enalagi`, `paraskinio`, `poll`, `password`, `egrafi`, `superuser`, " .
		"`proxy`, `melos` " .
		"FROM `pektis` ORDER BY `login`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function backup_sxesi() {
	global $globals;

	$fp = anixe_arxio("sxesi");
	$query = "SELECT `kodikos`, `pektis`, `sxetizomenos`, `status`, `dimiourgia` " .
		"FROM `sxesi` ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function backup_minima() {
	global $globals;

	$fp = anixe_arxio("minima");
	$query = "SELECT `kodikos`, `apostoleas`, `paraliptis`, `dimiourgia` " .
		"`katastasi`, `minima` " .
		"FROM `minima` ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function backup_trapezi() {
	global $globals;

	$trapezi = apo_trapezi();
	$eos = 0;
	$fp = anixe_arxio("trapezi");
	$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3`, " .
		"`pasopasopaso`, `asoi`, `stisimo`, `telos` FROM `trapezi_log` " .
		"WHERE `kodikos` >= " . $trapezi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
		if ($row[0] > $eos) {
			$eos = $row[0];
		}
	}
	fclose($fp);
	print_data($count . ' [<span style="background-color: #FFFF66;">' .
		$trapezi . " - " . $eos . "</span>]");
}

function backup_dianomi() {
	global $globals;

	$trapezi = apo_trapezi();
	$fp = anixe_arxio("dianomi");
	$query = "SELECT `kodikos`, `trapezi`, `dealer`, `kasa1`, `metrita1`, " .
		"`kasa2`, `metrita2`, `kasa3`, `metrita3`, `enarxi` FROM `dianomi_log` " .
		"WHERE `trapezi` >= " . $trapezi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function backup_kinisi() {
	global $globals;

	$trapezi = apo_trapezi();
	$fp = anixe_arxio("kinisi");
	$query = "SELECT DISTINCT `kinisi_log`.`kodikos`, `kinisi_log`.`dianomi`, `kinisi_log`.`pektis`, " .
		"`kinisi_log`.`idos`, `kinisi_log`.`data`, `kinisi_log`.`pote` " .
		"FROM `kinisi_log`, `dianomi_log` WHERE (`kinisi_log`.`dianomi` = `dianomi_log`.`kodikos`) " .
		"AND (`dianomi_log`.`trapezi` >= " . $trapezi . ") ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function backup_sinedria() {
	global $globals;

	$fp = anixe_arxio("sinedria");
	$query = "SELECT `kodikos`, `pektis`, `ip`, `dimiourgia`, `enimerosi`, `telos` " .
		"FROM `sinedria_log` ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	for ($count = 0; $row = @mysqli_fetch_array($result, MYSQLI_NUM); $count++) {
		write_grami($fp, $row);
	}
	fclose($fp);
	print_data($count);
}

function apo_trapezi() {
	global $globals;

	if (!Globals::perastike('trapezi')) {
		return 1;
	}

	$trapezi = $_REQUEST['trapezi'];
	if (preg_match("/^[0-9]+$/", $trapezi)) {
		return $trapezi;
	}

	$globals->klise_fige($trapezi . ": λάθος αριθμός πρώτου τραπεζιού");
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

function print_data($data) {
	print $data . "@@ok";
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
