<?php
require_once '../lib/standard.php';
require_once '../lib/pektis.php';
Page::data();
set_globals();
$globals->pektis_check();

$login = $globals->asfales($globals->pektis->login);

Globals::perastike_check('katastasi');
$katastasi = $globals->asfales($_REQUEST['katastasi']);

$query = "UPDATE `παίκτης` SET `κατάσταση` = '" . $katastasi .
	"' WHERE `login` LIKE '" . $login . "'";
$result = $globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν έγινε αλλαγή κατάστασης');
}
?>
