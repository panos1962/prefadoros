<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->theatis) {
	die('Δεν μπορείτε να αλλάξετε το πάσο, πάσο, πάσο ως θεατής');
}

Prefadoros::klidose_trapezi();

$ppp = ($globals->trapezi->ppp ? 'NO' : 'YES');

$query = "UPDATE `τραπέζι` SET `πάσοπάσοπάσο` = '" . $ppp .
	"' WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Δεν έγινε η αλλαγή του πάσο, πάσο, πάσο');
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
