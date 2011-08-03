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
	die('Δεν μπορείτε να αλλάξετε τη διάταξη των παικτών ως θεατής');
}

Prefadoros::klidose_trapezi();

switch ($globals->trapezi->thesi) {
case 1:		$ena = 2; $dio = 3; break;
case 2:		$ena = 1; $dio = 3; break;
case 3:		$ena = 1; $dio = 2; break;
default:	die('Ακαθόριστη θέση παίκτη');
}

$pektis1 = "pektis" . $ena;
$pektis1 = $globals->trapezi->$pektis1;
if ($pektis1 == '') { $pektis1 = 'NULL'; }
else { $pektis1 = "'" . $globals->asfales($pektis1) . "'"; }

$pektis2 = "pektis" . $dio;
$pektis2 = $globals->trapezi->$pektis2;
if ($pektis2 == '') { $pektis2 = 'NULL'; }
else { $pektis2 = "'" . $globals->asfales($pektis2) . "'"; }

$query = "UPDATE `τραπέζι` SET `παίκτης" . $ena . "` = " . $pektis2 .
	", `αποδοχή" . $ena . "` = 'NO', `παίκτης" . $dio . "` = " .
	$pektis1 . ", `αποδοχή" . $dio . "` = 'NO' " .
	"WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Δεν έγινε αλλαγή στη διάταξη των παικτών');
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
