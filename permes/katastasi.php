<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('minima');
$minima = $globals->asfales($_REQUEST['minima']);

Globals::perastike_check('katastasi');
$katastasi = $globals->asfales($_REQUEST['katastasi']);

$query = "UPDATE `μήνυμα` SET `κατάσταση` = '" . $katastasi .
	"' WHERE `κωδικός` = " . $minima;
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	die('Απέτυχε η αλλαγή κατάστασης του μηνύματος');
}
?>
