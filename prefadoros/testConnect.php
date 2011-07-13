<?php
header('Content-type: text/data; charset=utf-8');
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::pektis_check();
print mt_rand() . '@' . $globals->pektis->login;
?>
