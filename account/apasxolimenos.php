<?php
require_once '../lib/standard.php';
set_globals();
if (!$globals->is_pektis()) {
	die('ακαθόριστος παίκτης');
}

Globals::perastike_check('katastasi');
$katastasi = Globals::asfales($_REQUEST['katastasi']);

$query = "UPDATE `παίκτης` SET `κατάσταση` = '" . $katastasi .
	"' WHERE `login` LIKE '" . Globals::asfales($globals->pektis->login) . "'";
$result = Globals::sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν έγινε αλλαγή κατάστασης');
}
?>
