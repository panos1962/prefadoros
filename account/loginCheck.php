<?php
require_once('../lib/standard.php');
set_globals();

if (!perastike('login')) {
	telos('login missing');
}

if (!perastike('password')) {
	telos('password missing');
}

$query = "SELECT * FROM `παίκτης` WHERE `login` LIKE '" .
	asfales($_REQUEST['login']) . "' AND `password` LIKE '" .
	asfales(sha1($_REQUEST['password'])) . "'";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	telos('loginCheck.php: ' . @mysqli_error($globals->db));
}

$row = @mysqli_fetch_array($result);
if (!$row) {
	telos('Access denied');
}

mysqli_free_result($result);
$_SESSION['ps_login'] = $_REQUEST['login'];
telos(AJAX_SEPARATOR);
?>
