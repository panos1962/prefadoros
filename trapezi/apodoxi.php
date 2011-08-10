<?php
require_once '../lib/standard.php';
require_once '../lib/trapoula.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/kinisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();

$thesi = Globals::perastike_check('thesi');
$pektis = "pektis" . $thesi;
if ((!isset($globals->trapezi->$pektis)) ||
	($globals->trapezi->$pektis != $globals->pektis->login)) {
	die('Λάθος θέση παίκτη');
}

$nea = Globals::perastike_check('apodoxi');

Prefadoros::klidose_trapezi();

$query = "UPDATE `τραπέζι` SET `αποδοχή" . $thesi . "` = '" .
	$globals->asfales($nea) . "' WHERE `κωδικός` = " .
	$globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η αλλαγή αποδοχής');
}

$apodoxi = "apodoxi" . $thesi;
$globals->trapezi->$apodoxi = ($nea == "YES");

$count = 0;
for ($i = 1; $i <= 3; $i++) {
	$apodoxi = "apodoxi" . $i;
	if ($globals->trapezi->$apodoxi) {
		$count++;
	}
}

if ($count >= 3) {
	kane_dianomi();
}

Prefadoros::xeklidose_trapezi(TRUE);

function kane_dianomi() {
	global $globals;

	$trapoula = new Trapoula();
	$trapoula->anakatema();

	$globals->trapezi->fetch_dianomi();
	$nd = count($globals->dianomi);
	if ($nd > 0) {
		$dealer = $globals->dianomi[$nd - 1]->dealer + 1;
		if ($dealer > 3) { $dealer = 1; }
	}
	else {
		$dealer = mt_rand(1, 3);
	}

	$query = "INSERT INTO `διανομή` (`τραπέζι`, `dealer`) VALUES " .
		"(" . $globals->trapezi->kodikos . ", " . $dealer . ")";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		die("Απέτυχε η διανομή");
	}
	$dianomi = @mysqli_insert_id($globals->db);

	$data = $dealer;
	for ($i = 0; $i < 3; $i++) {
		$data .= ":";
		$apo = $i * 10;
		$eos = $apo + 10;
		for ($j = $apo; $j < $eos; $j++) {
			$data .= $trapoula->fila[$j];
		}
	}

	$data .= ":";
	for ($j = 30; $j < 32; $j++) {
		$data .= $trapoula->fila[$j];
	}

	Kinisi::insert($dianomi, $dealer, "ΔΙΑΝΟΜΗ", $data);
}
?>
