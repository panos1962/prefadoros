<?php
require_once '../lib/standard.php';
set_globals();

Globals::perastike_check('login');
Globals::perastike_check('password');
$query = "SELECT * FROM `παίκτης` WHERE `login` LIKE '" .
	Globals::asfales($_REQUEST['login']) . "' AND `password` LIKE '" .
	Globals::asfales(sha1($_REQUEST['password'])) . "'";
$result = Globals::sql_query($query);
$row = @mysqli_fetch_array($result);
if (!$row) {
	die('Access denied');
}

@mysqli_free_result($result);
$_SESSION['ps_login'] = $_REQUEST['login'];
?>
