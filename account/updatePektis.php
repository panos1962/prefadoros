<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

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

Globals::perastike_check('enalagi');
$enalagi = "'" . $globals->asfales($_REQUEST['enalagi']) . "'";

Globals::perastike_check('password');
$password = $globals->asfales($_REQUEST['password']);

$where_clause = " WHERE `login` = " . $globals->pektis->slogin .
	" AND `password` = '" . sha1($password) . "'";
$query = "SELECT `login` FROM `pektis`" . $where_clause;
$result = $globals->sql_query($query);
$not_found = TRUE;
while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
	$not_found = FALSE;
}
if ($not_found) {
	die('Δώσατε λάθος κωδικό');
}

$query = "UPDATE `pektis` SET `onoma` = '" . $onoma . "', `email` = " . $email .
	", `plati` = " . $plati . ", `enalagi` = " . $enalagi;
if (Globals::perastike('password1') && ($_REQUEST['password1'])) {
	$query .= ", `password` = '" . sha1($globals->asfales($_REQUEST['password1'])) . "'";
}
$query .= $where_clause;

$no_change = TRUE;
$result = $globals->sql_query($query);
if (mysqli_affected_rows($globals->db) == 1) {
	$no_change = FALSE;
}

if (Globals::perastike('photoEnergia')) {
	switch ($_REQUEST['photoEnergia']) {
	case 'restore':
		restore_photo();
		$no_change = FALSE;
		break;
	case 'delete':
		delete_photo();
		$no_change = FALSE;
		break;
	}
}

if ($no_change) {
	die('NO_CHANGE');
}

function restore_photo() {
	global $globals;

	$basi = "../photo/" . strtolower(substr($globals->pektis->login, 0, 1)) .
		"/" . $globals->pektis->login;
	$tipos = "jpg";
	$ikona = $basi . "." . $tipos;
	$kopia = $basi . "~." . $tipos;
	$aipok = $basi . "~~." . $tipos;

	if (!@rename($ikona, $aipok)) {
		@copy($kopia, $ikona);
		@chmod($ikona, 0666);
		return;
	}
	@chmod($aipok, 0666);

	if (@rename($kopia, $ikona)) {
		@chmod($ikona, 0666);
		@rename($aipok, $kopia);
		@chmod($kopia, 0666);
	}
	else {
		@rename($aipok, $ikona);
		@chmod($ikona, 0666);
	}
}

function delete_photo() {
	global $globals;

	$basi = "../photo/" . strtolower(substr($globals->pektis->login, 0, 1)) .
		"/" . $globals->pektis->login;
	$tipos = "jpg";
	$ikona = $basi . "." . $tipos;

	@unlink($ikona);
}

?>
