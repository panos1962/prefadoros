<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();
Prefadoros::pektis_check();
$login = "'" . $globals->asfales($globals->pektis->login) . "'";

Globals::perastike_check('pektis');
$pektis = "'" . $globals->asfales($_REQUEST['pektis']) . "'";

$query = "DELETE FROM `sxesi` WHERE (`pektis` = " . $login .
	") AND (`sxetizomenos` = " . $pektis . ")";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	@mysqli_rollback($globals->db);
	die('Απέτυχε η αποσυσχέτιση (' . @mysqli_error($globals->db) . ')');
}
?>
