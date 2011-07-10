<?php
require_once '../lib/standard.php';
require_once '../lib/pektis.php';
Page::data();
set_globals();
$globals->pektis_check();

$login = Globals::asfales($globals->pektis->login);

Globals::perastike_check('katastasi');
$katastasi = Globals::asfales($_REQUEST['katastasi']);

$query = "UPDATE `παίκτης` SET `κατάσταση` = '" . $katastasi .
	"' WHERE `login` LIKE '" . $login . "'";
$result = Globals::sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν έγινε αλλαγή κατάστασης');
}
?>
