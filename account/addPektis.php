<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
Page::data();
set_globals();

Globals::perastike_check('login');
$login = $globals->asfales($_REQUEST['login']);

Globals::perastike_check('onoma');
$onoma = $globals->asfales($_REQUEST['onoma']);

Globals::perastike_check('email');
if ($_REQUEST['email'] == '') {
	$email = 'NULL';
}
else {
	Globals::email_check($_REQUEST['email']);
	$email = "'" . $globals->asfales($_REQUEST['email']) . "'";
}

Globals::perastike_check('plati');
$plati = "'" . $globals->asfales($_REQUEST['plati']) . "'";

Globals::perastike_check('password');
$password = $globals->asfales($_REQUEST['password']);

$query = "INSERT INTO `παίκτης` (`login`, `όνομα`, `email`, `πλάτη`, " .
	"`poll`, `password`) VALUES ('" . $login . "', '" . $onoma . "', "
	. $email . ", " . $plati . ", NOW(), '" . sha1($password) . "')";
$result = $globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	print 'Δεν δημιουργήθηκε λογαριασμός (' . @mysqli_error($globals->db) . ')';
	die(1);
}

$_SESSION['ps_login'] = $_REQUEST['login'];
?>
