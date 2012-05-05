<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$affected = 0;

$query = "DELETE FROM `sizitisi` WHERE (`pektis` = BINARY " .
	$globals->pektis->slogin . ") AND (`sxolio` REGEXP '^@W[PK]@$')";
$globals->sql_query($query);
$affected += @mysqli_affected_rows($globals->db);

// Καθαρίζουμε παλαιά writing σχόλια όλων των παικτών.
$palia_ts = time() - 120;
$query = "DELETE FROM `sizitisi` WHERE (UNIX_TIMESTAMP(`pote`) < " .
	$palia_ts . ") AND (`sxolio` REGEXP '^@W[PK]@$')";
$globals->sql_query($query);
$affected += @mysqli_affected_rows($globals->db);

if ($affected > 0) {
	Sizitisi::set_dirty();
}
?>
