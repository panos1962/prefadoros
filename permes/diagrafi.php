<?php
require_once '../lib/standard.php';
Page::data();
set_globals();
Globals::perastike_check('minima');
$minima = $globals->asfales($_REQUEST['minima']);

$query = "DELETE FROM `μήνυμα` WHERE `κωδικός` = " . $minima;
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	die('Απέτυχε η διαγραφή του μηνύματος');
}
?>
