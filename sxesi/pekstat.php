<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Globals::perastike_check('sinedria');
$sinedria = $globals->asfales($_REQUEST['sinedria']);

Globals::perastike_check('pekstat');
$pekstat = $globals->asfales($_REQUEST['pekstat']);

$query = "UPDATE `sinedria` SET `pekstat` = '" . $pekstat . "' WHERE `kodikos` = " . $sinedria;
$globals->sql_query($query);
?>
