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

if ($globals->trapezi->simetoxi == 'ΘΕΑΤΗΣ') {
	$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE '" .
		$globals->pektis->login . "'";
	$globals->sql_query($query);
	if (mysqli_affected_rows($globals->db) != 1) {
		print 'Απέτυχε η έξοδος από το τραπέζι ως θεατή';
	}
	die(0);
}

$pektis = 'pektis' . $globals->trapezi->thesi;
if ($globals->trapezi->$pektis != $globals->pektis->login) {
	die('Δεν συμμετέχετε στο τραπέζι');
}

$query = "UPDATE `τραπέζι` SET `παίκτης" . $globals->trapezi->thesi .
	"` = NULL WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η έξοδος από το τραπέζι ως παίκτη');
}
?>
