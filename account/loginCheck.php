<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
Page::data();
set_globals();

Globals::perastike_check('login');
Globals::perastike_check('password');
$query = "SELECT `paraskinio` FROM `pektis` WHERE `login` COLLATE utf8_bin = '" .
	$globals->asfales($_REQUEST['login']) . "' AND `password` COLLATE utf8_bin = '" .
	$globals->asfales(sha1($_REQUEST['password'])) . "'";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if (!$row) {
	die('Access denied');
}

@mysqli_free_result($result);
$_SESSION['ps_login'] = $_REQUEST['login'];
$_SESSION['ps_paraskinio'] = $row[0];
?>
