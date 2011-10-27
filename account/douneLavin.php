<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

Globals::perastike_check('kapikia');
$kapikia = $globals->asfales($_REQUEST['kapikia']);

$query = "UPDATE `pektis` SET `kapikia` = '" . $kapikia . "' " .
	"WHERE `login` = " . $globals->pektis->slogin;
$result = $globals->sql_query($query);
?>
