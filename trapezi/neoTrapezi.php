<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
if (Prefadoros::set_trapezi()) {
	die('Πρέπει να εξέλθετε πρώτα από το τρέχον τραπέζι');
}

$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE '" . $globals->pektis->login . "'";
$globals->sql_query($query);

$query = "INSERT INTO `τραπέζι` (`παίκτης1`) VALUES ('" .
	$globals->asfales($globals->pektis->login) . "')";
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η δημιουργία νέου τραπεζιού');
}
?>
