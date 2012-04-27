<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('minima');
$minima = $globals->asfales($_REQUEST['minima']);

Globals::perastike_check('katastasi');
$katastasi = $globals->asfales($_REQUEST['katastasi']);

$query = "UPDATE `minima` SET `katastasi` = '" . $katastasi .
	"' WHERE `kodikos` = " . $minima;
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	$globals->klise_fige('Απέτυχε η αλλαγή κατάστασης του μηνύματος');
}
$globals->klise_fige();
?>
