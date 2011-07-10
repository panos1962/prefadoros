<?php
require_once '../lib/standard.php';
require_once '../lib/pektis.php';
require_once '../lib/trapezi.php';
Page::data();
set_globals();
$globals->pektis_check();

$login = $globals->asfales($globals->pektis->login);

Globals::perastike_check('kapikia');
$kapikia = $globals->asfales($_REQUEST['kapikia']);

$query = "UPDATE `παίκτης` SET `καπίκια` = '" . $kapikia . "' " .
	"WHERE `login` LIKE '" . $login . "'";
$result = $globals->sql_query($query);
?>
