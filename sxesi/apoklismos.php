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

@mysqli_autocommit($globals->db, FALSE);
$query = "DELETE FROM `sxesi` WHERE (`pektis` = " . $login .
	") AND (`sxetizomenos` = " . $pektis . ")";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	@mysqli_rollback($globals->db);
	die('Απέτυχε η διαγραφή σχέσης (' . @mysqli_error($globals->db) . ')');
}

$query = "INSERT INTO `sxesi` (`pektis`, `sxetizomenos`, `status`) " .
	"VALUES (" . $login . ", " . $pektis . ", 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ')";
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (@mysqli_affected_rows($globals->db) != 1)) {
	@mysqli_rollback($globals->db);
	die('Απέτυχε ο αποκλεισμός του παίκτη "' . $_REQUEST['pektis'] .
		'" (' . @mysqli_error($globals->db) . ')');
}
@mysqli_commit($globals->db);
?>
