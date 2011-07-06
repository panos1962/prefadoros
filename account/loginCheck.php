<?php
require_once '../lib/standard.php';
set_globals();

if (!Globals::perastike('login')) {
	Globals::fatal('login missing');
}

if (!Globals::perastike('password')) {
	Globals::fatal('password missing');
}

$query = "SELECT * FROM `παίκτης` WHERE `login` LIKE '" .
	Globals::asfales($_REQUEST['login']) . "' AND `password` LIKE '" .
	Globals::asfales(sha1($_REQUEST['password'])) . "'";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	Globals::fatal('loginCheck.php: ' . @mysqli_error($globals->db));
}

$row = @mysqli_fetch_array($result);
if (!$row) {
	die('Access denied');
}

@mysqli_free_result($result);
$_SESSION['ps_login'] = $_REQUEST['login'];
?>
