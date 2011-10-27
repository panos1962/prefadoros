<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

$thesi = $globals->asfales(Globals::perastike_check('thesi'));
Prefadoros::pektis_check();

$query = "UPDATE `theatis` SET `thesi` = " . $thesi .
	" WHERE `pektis` = " . $globals->pektis->slogin;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η αλλαγή θέσης θέασης');
}
?>
