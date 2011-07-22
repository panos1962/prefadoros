<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Globals::perastike_check('sinedria');
$sinedria = $globals->asfales($_REQUEST['sinedria']);

Globals::perastike_check('peknpat');
$peknpat = $globals->asfales($_REQUEST['peknpat']);

$query = "UPDATE `συνεδρία` SET `peknpat` = '" . $peknpat . "' WHERE `κωδικός` = " . $sinedria;
$globals->sql_query($query);
?>
