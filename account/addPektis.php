<?php
unset($_SESSION['ps_login']);
require_once '../lib/standard.php';
Page::data();
set_globals();

Globals::perastike_check('login');
$login = Globals::asfales($_REQUEST['login']);

Globals::perastike_check('onoma');
$onoma = Globals::asfales($_REQUEST['onoma']);

Globals::perastike_check('email');
if ($_REQUEST['email'] == '') {
	$email = 'NULL';
}
else {
	Globals::email_check($_REQUEST['email']);
	$email = "'" . Globals::asfales($_REQUEST['email']) . "'";
}

Globals::perastike_check('password');
$password = Globals::asfales($_REQUEST['password']);

$query = "INSERT INTO `παίκτης` (`login`, `όνομα`, `email`, `poll`, `password`) VALUES ('" .
	$login . "', '" . $onoma . "', " . $email . ", NOW(), '" . sha1($password) . "')";
$result = Globals::sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	print 'Δεν δημιουργήθηκε λογαριασμός (' . @mysqli_error($globals->db) . ')';
	die(1);
}

$_SESSION['ps_login'] = $_REQUEST['login'];
?>
