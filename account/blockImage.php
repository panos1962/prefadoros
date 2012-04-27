<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$block = $globals->asfales(Globals::perastike_check('block'));

$query = "UPDATE `pektis` SET `blockimage` = '" . $block .
	"' WHERE `login` = BINARY " . $globals->pektis->slogin;
$globals->sql_query($query);
?>
