<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
Page::data();
set_globals();

Globals::perastike_check('login');
Globals::perastike_check('password');
$query = "SELECT * FROM `pektis` WHERE `login` LIKE '" .
	$globals->asfales($_REQUEST['login']) . "' AND `password` LIKE '" .
	$globals->asfales(sha1($_REQUEST['password'])) . "'";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result);
if (!$row) {
	die('Access denied');
}

@mysqli_free_result($result);
$_SESSION['ps_login'] = $_REQUEST['login'];
?>
