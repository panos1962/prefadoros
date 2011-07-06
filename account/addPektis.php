<?php
require_once '../lib/standard.php';
set_globals();

if (Globals::perastike('login')) {
	$login = Globals::asfales($_REQUEST['login']);
}
else {
	Globals::fatal('Δεν δόθηκε login name');
}

if (Globals::perastike('onoma')) {
	$onoma = Globals::asfales($_REQUEST['onoma']);
}
else {
	Globals::fatal('Δεν δόθηκε όνομα παίκτη');
}

if (Globals::perastike('email')) {
	$email = "'" . Globals::asfales($_REQUEST['email']) . "'";
}
else {
	$email = 'NULL';
}

if (Globals::perastike('password')) {
	$password = Globals::asfales($_REQUEST['password']);
}
else {
	Globals::fatal('Δεν δόθηκε κωδικός');
}

$query = "INSERT INTO `παίκτης` (`login`, `όνομα`, `email`, `poll`, `password`) VALUES ('" .
	$login . "', '" . $onoma . "', " . $email . ", NOW(), '" . sha1($password) . "')";
$result = @mysqli_query($globals->db, $query);
if ((!$result) || (mysqli_affected_rows($globals->db) != 1)) {
	Globals::fatal('Δεν δημιουργήθηκε λογαριασμός (' .
		@mysqli_error($globals->db) . ')');
}

$_SESSION['ps_login'] = $_REQUEST['login'];
?>
