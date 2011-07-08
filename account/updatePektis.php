<?php
require_once '../lib/standard.php';
Page::data();
set_globals();
$globals->pektis_check();

$login = Globals::asfales($globals->pektis->login);

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

$query = "UPDATE `παίκτης` SET `όνομα` = '" . $onoma . "', `email` = " . $email;
if (Globals::perastike('password1') && ($_REQUEST['password1'])) {
	$query .= ", `password` = '" . sha1(Globals::asfales($_REQUEST['password1'])) . "'";
}
$query .= " WHERE `login` LIKE '" . $login . "' AND `password` LIKE '" . sha1($password) . "'";

$result = Globals::sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	print 'Δεν έγιναν αλλαγές στα στοιχεία του λογαριασμού';
	die(1);
}
?>
