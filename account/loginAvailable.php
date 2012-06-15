<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('login');
$query = "SELECT * FROM `pektis` WHERE `login` = '" .
	$globals->asfales($_REQUEST['login']) . "'";
$result = $globals->sql_query($query, 'account/loginAvailable.php');
$row = @mysqli_fetch_array($result);
if ($row) {
	@mysqli_free_result($result);
	die('Το όνομα <span class="errorFyiData">' . $_REQUEST['login'] .
		'</span> δεν είναι διαθέσιμο');
}
?>
