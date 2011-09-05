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
	die('Δεν μπορείτε να αλλάξετε την κάσα ως θεατής');
}

switch ($globals->trapezi->kasa) {
case 50:	$kasa = 30; break;
default:	$kasa = 50; break;
}

Prefadoros::klidose_trapezi();

switch ($globals->trapezi->thesi) {
case 1:		$ena = 2; $dio = 3; break;
case 2:		$ena = 1; $dio = 3; break;
case 3:		$ena = 1; $dio = 2; break;
default:	die('Ακαθόριστη θέση παίκτη');
}

$query = "UPDATE `trapezi` SET `kasa` = " . $kasa .
	", `apodoxi" . $ena . "` = 'NO', `apodoxi" . $dio . "` = 'NO' " .
	"WHERE `kodikos` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Δεν έγινε η αλλαγή της κάσας');
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
