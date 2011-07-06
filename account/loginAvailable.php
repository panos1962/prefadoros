<?php
require_once '../lib/standard.php';
set_globals();

if (!Globals::perastike('login')) {
	Globals::fatal('login missing');
}

$query = "SELECT * FROM `παίκτης` WHERE `login` LIKE '" .
	Globals::asfales($_REQUEST['login']) . "'";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	Globals::fatal('account/loginAvailable.php: ' . @mysqli_error($globals->db));
}

$row = @mysqli_fetch_array($result);
if ($row) {
	Globals::fatal('Το όνομα "' . $_REQUEST['login'] .
		'" δεν είναι διαθέσιμο');
}

mysqli_free_result($result);
?>
