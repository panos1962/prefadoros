<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

$thesi = $globals->asfales(Globals::perastike_check('thesi'));
Prefadoros::pektis_check();

$query = "UPDATE `θεατής` SET `θέση` = " . $thesi .
	" WHERE `παίκτης` LIKE " . $globals->pektis->slogin;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η αλλαγή θέσης θέασης');
}
?>
