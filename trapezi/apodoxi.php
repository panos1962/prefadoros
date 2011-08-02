<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
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

$apodoxi = Globals::perastike_check('apodoxi');

Prefadoros::klidose_trapezi();

$query = "UPDATE `τραπέζι` SET `αποδοχή" . $thesi . "` = '" .
	$globals->asfales($apodoxi) . "' WHERE `κωδικός` = " .
	$globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η αλλαγή αποδοχής');
}

if (($globals->trapezi->pektis2 == '') || (!$globals->trapezi->apodoxi2) ||
	($globals->trapezi->pektis3 == '') || (!$globals->trapezi->apodoxi3)) {
	Prefadoros::xeklidose_trapezi(TRUE);
	die(0);
}

kane_dianomi();
Prefadoros::xeklidose_trapezi(TRUE);

function kane_dianomi() {
}
?>
