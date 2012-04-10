<?php
require_once '../lib/standard.php';
require_once 'photo.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
Page::data();
set_globals();

Globals::perastike_check('login');
$login = $_REQUEST['login'];
$slogin = $globals->asfales($login);

Globals::perastike_check('onoma');
$onoma = $_REQUEST['onoma'];
$sonoma = $globals->asfales($onoma);

Globals::perastike_check('email');
if ($_REQUEST['email'] == '') {
	$email = NULL;
	$semail = 'NULL';
}
else {
	Globals::email_check($_REQUEST['email']);
	$email = $_REQUEST['email'];
	$semail = "'" . $email . "'";
}

Globals::perastike_check('plati');
$plati = "'" . $globals->asfales($_REQUEST['plati']) . "'";

Globals::perastike_check('enalagi');
$enalagi = "'" . $globals->asfales($_REQUEST['enalagi']) . "'";

Globals::perastike_check('password');
$password = $globals->asfales($_REQUEST['password']);

$query = "INSERT INTO `pektis` (`login`, `onoma`, `email`, `plati`, `enalagi`, " .
	"`poll`, `password`) VALUES ('" . $slogin . "', '" . $sonoma . "', "
	. $semail . ", " . $plati . ", " . $enalagi . ", NOW(), '" . sha1($password) . "')";
$result = mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) != 1) {
	switch (@mysqli_errno($globals->db)) {
	case 1062:
		$globals->klise_fige('Το όνομα <span class="errorFyiData">' .
			$login . '</span> υπάρχει ήδη');
	}

	$globals->klise_fige('Δεν δημιουργήθηκε λογαριασμός (' . @mysqli_error($globals->db) . ')');
}

if (isset($email)) {
	@mail($email, 'Καλώς ήλθατε στον «Πρεφαδόρο»',
		'Η εγγραφή σας στον ιστότοπο της διαδικτυακής πρέφας έγινε με επιτυχία!<br />' .
		'Login: <b>'. $login . '</b><br />' .
		'Όνομα: <b><i>' . $onoma . '</i></b><br />' .
		'<hr /><br />' .
		'<small><i>Σημείωση</i><br />' .
		'Δεν χρειάζεται να απαντήσετε σε αυτό το μήνυμα.</small>',
		"From: prefadoros@prefadoros.gr\r\n" .
		"Content-Type: text/html; charset=utf-8\r\n");
}

check_pektis_photo($_REQUEST['login']);
$_SESSION['ps_login'] = $_REQUEST['login'];
$_SESSION['ps_paraskinio'] = DEFAULT_PARASKINIO;
?>
