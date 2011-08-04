<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

$dif = intval(Globals::perastike_check('dif'));
Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->theatis) {
	die('Δεν μπορείτε να αλλάξετε την κάσα ως θεατής');
}

$query = "UPDATE `τραπέζι` SET `κάσα` = (`κάσα` + " . $dif .
	") WHERE `κωδικός` LIKE " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Απέτυχε η αλλαγή της κάσας');
}
?>
