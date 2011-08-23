<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
if (!Prefadoros::set_trapezi()) {
	die('Ακαθόριστο τραπέζι');
}
if (!$globals->trapezi->is_pektis()) {
	die('Δεν έχετε δικαίωμα αλλαγής της ιδιωτικότητας του τραπεζιού');
}

$idiotikotita = Globals::perastike_check('idiotikotita');
@mysqli_autocommit($globals->db, FALSE);

$query = "UPDATE `τραπέζι` SET `ιδιωτικότητα` = '" . $globals->asfales($idiotikotita) .
	"' WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	@mysqli_rollback($globals->db);
	die('Δεν άλλαξε η ιδιωτικότητα του τραπεζιού');
}

if ($idiotikotita != 'ΔΗΜΟΣΙΟ') {
	$query = "DELETE FROM `θεατής` WHERE (`τραπέζι` = " . $globals->trapezi->kodikos .
		") AND (`παίκτης` NOT IN (SELECT `ποιον` FROM `πρόσκληση` WHERE `τραπέζι` = " .
		$globals->trapezi->kodikos . "))";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) {
		@mysqli_rollback($globals->db);
		die('Απέτυχε η αποπομπή των απρόσκλητων θεατών');
	}
}

@mysqli_commit($globals->db);
?>
