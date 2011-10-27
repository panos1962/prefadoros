<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('login');
$query = "SELECT * FROM `pektis` WHERE `login` = '" .
	$globals->asfales($_REQUEST['login']) . "'";
$result = $globals->sql_query($query, 'account/loginAvaileable.php');
$row = @mysqli_fetch_array($result);
if ($row) {
	@mysqli_free_result($result);
	die('Το όνομα "' . $_REQUEST['login'] . '" δεν είναι διαθέσιμο');
}
?>
