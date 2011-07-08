<?php
require_once '../lib/standard.php';
Page::data();
set_globals();
$globals->pektis_check();

$login = Globals::asfales($globals->pektis->login);

Globals::perastike_check('kapikia');
$kapikia = Globals::asfales($_REQUEST['kapikia']);

$query = "UPDATE `παίκτης` SET `καπίκια` = '" . $kapikia . "' " .
	"WHERE `login` LIKE '" . $login . "'";
$result = Globals::sql_query($query);
?>
