<?php
require_once('../lib/standard.php');
set_globals();

if (perastike('login')) {
	$login = asfales($_REQUEST['login']);
}
else {
	telos('Δεν δόθηκε login name');
}

if (perastike('onoma')) {
	$onoma = asfales($_REQUEST['onoma']);
}
else {
	telos('Δεν δόθηκε όνομα παίκτη');
}

if (perastike('email')) {
	$email = "'" . asfales($_REQUEST['email']) . "'";
}
else {
	$email = 'NULL';
}

if (perastike('password')) {
	$password = asfales($_REQUEST['password']);
}
else {
	telos('Δεν δόθηκε κωδικός');
}

$query = "UPDATE `παίκτης` SET `όνομα` = '" . $onoma .
	"', `email` = " . $email;
if (perastike('password1') && ($_REQUEST['password1'])) {
	$query .= ", `password` = '" .
		sha1(asfales($_REQUEST['password1'])) . "'";
}
$query .= " WHERE `login` LIKE '" . $login .
	"' AND `password` LIKE '" . sha1($password) . "'";

$result = @mysqli_query($globals->db, $query);
if (!$result) {
	telos(@mysqli_error($globals->db));
}

if (mysqli_affected_rows($globals->db) != 1) {
	telos('Δεν έγιναν αλλαγές στα στοιχεία του λογαριασμού');
}

telos();
?>
