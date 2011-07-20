<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$login = $globals->asfales($globals->pektis->login);

Globals::perastike_check('pros');
$pros = $globals->asfales($_REQUEST['pros']);

Globals::perastike_check('minima');
$minima = $globals->asfales($_REQUEST['minima']);

$query = "INSERT INTO `μήνυμα` (`αποστολέας`, `παραλήπτης`, `μήνυμα`) " .
	"VALUES ('" . $login . "', '" . $pros . "', '" . $minima . "')";
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	die('Απέτυχε η αποστολή του μηνύματος');
}
?>
