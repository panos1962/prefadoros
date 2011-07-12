<?php
require_once '../lib/standard.php';
require_once '../lib/pektis.php';
require_once '../lib/Prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$login = $globals->asfales($globals->pektis->login);
$katastasi = $globals->asfales(Globals::perastike_check('katastasi'));

$query = "UPDATE `παίκτης` SET `κατάσταση` = '" . $katastasi .
	"' WHERE `login` LIKE '" . $login . "'";
$globals->sql_query($query);
/*
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν έγινε αλλαγή κατάστασης');
}
*/
?>
