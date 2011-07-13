<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
die(0);
Prefadoros::pektis_check();

$idiotikotita = $globals->asfales(Globals::perastike_check('idiotikotita'));

$query = "UPDATE `τραπέζι` SET `ιδιωτικότητα` = '" . $idiotikotita .
	"' WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν άλλαξε η ιδιωτικότητα του τραπεζιού');
}
?>
