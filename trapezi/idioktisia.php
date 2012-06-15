<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
if (!Prefadoros::set_trapezi()) {
	die('Ακαθόριστο τραπέζι');
}
if ((!$globals->trapezi->is_pektis()) ||
	($globals->trapezi->pektis1 != $globals->pektis->login)) {
	die('Δεν έχετε δικαίωμα αλλαγής του ιδιοκτησιακού καθεστώτος');
}

$idioktisia = Globals::perastike_check('idioktisia');

$query = "UPDATE `trapezi` SET `idioktisia` = '" . $globals->asfales($idioktisia) .
	"' WHERE `kodikos` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	@mysqli_rollback($globals->db);
	die('Δεν άλλαξε το ιδιοκτησιακό καθεστώς');
}
$globals->klise_fige();
?>
