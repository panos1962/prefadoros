<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
if (!Prefadoros::set_trapezi()) {
	$globals->klise_fige('Ακαθόριστο τραπέζι');
}
if (!$globals->trapezi->is_pektis()) {
	$globals->klise_fige('Δεν έχετε δικαίωμα αλλαγής της πρόσβασης στο τραπέζι');
}

$prosvasi = Globals::perastike_check('prosvasi');
$query = "UPDATE `trapezi` SET `prosvasi` = '" . $globals->asfales($prosvasi) .
	"' WHERE `kodikos` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	$globals->klise_fige('Δεν άλλαξε η ιδιωτικότητα του τραπεζιού');
}
$globals->klise_fige();
?>
