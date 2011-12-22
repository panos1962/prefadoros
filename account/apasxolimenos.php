<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$katastasi = $globals->asfales(Globals::perastike_check('katastasi'));

$query = "UPDATE `pektis` SET `katastasi` = '" . $katastasi .
	"' WHERE `login` = BINARY " . $globals->pektis->slogin;
$globals->sql_query($query);
?>
