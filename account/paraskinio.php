<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

Globals::perastike_check('paraskinio');
$paraskinio = $globals->asfales($_REQUEST['paraskinio']);

$query = "UPDATE `pektis` SET `paraskinio` = '" . $paraskinio . "' " .
	"WHERE `login` = " . $globals->pektis->slogin;
$globals->sql_query($query);
?>
