<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('login');
$query = "SELECT * FROM `παίκτης` WHERE `login` LIKE '" .
	Globals::asfales($_REQUEST['login']) . "'";
$result = Globals::sql_query($query, 'account/loginAvaileable.php');
$row = @mysqli_fetch_array($result);
if ($row) {
	@mysqli_free_result($result);
	die('Το όνομα "' . $_REQUEST['login'] . '" δεν είναι διαθέσιμο');
}
?>
