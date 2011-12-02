<?php
require_once '../lib/standard.php';
Page::data();
set_globals();
Globals::perastike_check('minima');
$minima = $globals->asfales($_REQUEST['minima']);

$query = "DELETE FROM `minima` WHERE `kodikos` = " . $minima;
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	$globals->klise_fige('Απέτυχε η διαγραφή του μηνύματος');
}
$globals->klise_fige();
?>
