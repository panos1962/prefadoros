<?php
require_once '../lib/standard.php';
set_globals();

if (Globals::perastike('login')) {
	if ($_REQUEST['login'] != $globals->pektis->login) {
		Globals::fatal('Απόπειρα εισβολής από "' . $_REQUEST['login'] . '"');
	}

	$login = Globals::asfales($_REQUEST['login']);
}
else {
	Globals::fatal('Δεν δόθηκε login name');
}

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

$query = "UPDATE `παίκτης` SET `όνομα` = '" . $onoma .
	"', `email` = " . $email;
if (Globals::perastike('password1') && ($_REQUEST['password1'])) {
	$query .= ", `password` = '" .
		sha1(Globals::asfales($_REQUEST['password1'])) . "'";
}
$query .= " WHERE `login` LIKE '" . $login .
	"' AND `password` LIKE '" . sha1($password) . "'";

$result = Globals::sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	die('Δεν έγιναν αλλαγές στα στοιχεία του λογαριασμού');
}
?>
