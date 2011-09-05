<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$login = $globals->asfales($globals->pektis->login);

Globals::perastike_check('kapikia');
$kapikia = $globals->asfales($_REQUEST['kapikia']);

$query = "UPDATE `pektis` SET `kapikia` = '" . $kapikia . "' " .
	"WHERE `login` LIKE '" . $login . "'";
$result = $globals->sql_query($query);
?>
