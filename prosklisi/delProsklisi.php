<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
Page::data();
set_globals();

Prefadoros::pektis_check();

if (Globals::perastike('oles')) {
	$query = "DELETE FROM `prosklisi` WHERE (`pios` = " .
		$globals->pektis->slogin . ") OR (`pion` = " .
		$globals->pektis->slogin . ")";
	$errmsg = "των προσκλήσεων";
}
else {
	Globals::perastike_check('kodikos');
	$kodikos = $globals->asfales($_REQUEST['kodikos']);
	$query = "SELECT `pios`, `pion` FROM `prosklisi` " .
		"WHERE `kodikos` = " . $kodikos;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die("Δεν βρέθηκε η πρόσκληση " . $_REQUEST['kodikos']);
	}
	@mysqli_free_result($result);
	if (($row[0] != $globals->pektis->login) &&
		($row[1] != $globals->pektis->login)) {
		die("Δεν έχετε δικαίωμα διαγραφής της πρόσκλησης " . $_REQUEST['kodikos']);
	}

	$query = "DELETE FROM `prosklisi` WHERE `kodikos` = " . $kodikos;
	$errmsg = "της πρόσκλησης " . $_REQUEST['kodikos'];
}

@mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) < 1) {
	die("Απέτυχε η διαγραφή " . $errmsg);
}
?>
