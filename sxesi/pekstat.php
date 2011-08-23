<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Globals::perastike_check('sinedria');
$sinedria = $globals->asfales($_REQUEST['sinedria']);

Globals::perastike_check('pekstat');
$pekstat = $globals->asfales($_REQUEST['pekstat']);

$query = "UPDATE `συνεδρία` SET `pekstat` = '" . $pekstat . "' WHERE `κωδικός` = " . $sinedria;
$globals->sql_query($query);
?>
