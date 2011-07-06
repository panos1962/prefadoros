<?php
require_once '../lib/standard.php';
set_globals();

Globals::perastike_check('login');
$login = Globals::asfales($_REQUEST['login']);

Globals::perastike_check('onoma');
$onoma = Globals::asfales($_REQUEST['onoma']);

if (Globals::perastike('email')) {
	$email = "'" . Globals::asfales($_REQUEST['email']) . "'";
}
else {
	$email = 'NULL';
}

Globals::perastike_check('password');
$password = Globals::asfales($_REQUEST['password']);

$query = "INSERT INTO `παίκτης` (`login`, `όνομα`, `email`, `poll`, `password`) VALUES ('" .
	$login . "', '" . $onoma . "', " . $email . ", NOW(), '" . sha1($password) . "')";
$result = Globals::sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Globals::fatal('Δεν δημιουργήθηκε λογαριασμός (' . @mysqli_error($globals->db) . ')');
}

$_SESSION['ps_login'] = $_REQUEST['login'];
?>
