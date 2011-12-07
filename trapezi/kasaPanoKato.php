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
	$globals->klise_fige('Δεν μπορείτε να αλλάξετε την κάσα ως θεατής');
}

if (($globals->trapezi->kasa += $dif) < 0) {
	$globals->trapezi->kasa = 0;
}

$query = "UPDATE `trapezi` SET `kasa` = " . $globals->trapezi->kasa .
	" WHERE `kodikos` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	$globals->klise_fige('Απέτυχε η αλλαγή της κάσας');
}
$globals->klise_fige();
?>
