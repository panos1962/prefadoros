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

$ppp = ($globals->trapezi->ppp != 0 ? 'NO' : 'YES');

Prefadoros::klidose_trapezi();

switch ($globals->trapezi->thesi) {
case 1:		$ena = 2; $dio = 3; break;
case 2:		$ena = 1; $dio = 3; break;
case 3:		$ena = 1; $dio = 2; break;
default:	die('Ακαθόριστη θέση παίκτη');
}

$query = "UPDATE `τραπέζι` SET `πάσοπάσοπάσο` = '" . $ppp .
	"', `αποδοχή" . $ena . "` = 'NO', `αποδοχή" . $dio . "` = 'NO' " .
	"WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Δεν έγινε η αλλαγή του πάσο, πάσο, πάσο');
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
