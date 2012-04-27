<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::set_trapezi();

switch ($pk = Globals::perastike_check('pk')) {
case 'P':
	check_trapezi();
	$trapezi = $globals->trapezi->kodikos;
	$sxolio = "@WP@";
	break;
case 'K':
	$trapezi = "NULL";
	$sxolio = "@WK@";
	break;
default:
	if (Sizitisi::cleanup_writing() > 0) {
		Sizitisi::set_dirty(FALSE);
	}
	$globals->klise_fige();
}

// Πρώτα δοκιμάζουμε να ενημερώσουμε τυχόν υπάρχοντα writing
// σχόλια για τον παίκτη.
$query = "UPDATE `sizitisi` SET `sxolio` = '" . $globals->asfales($sxolio) .
 	"', `trapezi` = " . $trapezi . " WHERE (`pektis` = BINARY " .
	$globals->pektis->slogin . ") AND (`sxolio` IN ('@WP@', '@WK@'))";
@mysqli_query($globals->db, $query);

// Εφόσον δεν ενημερώθηκαν υπάρχοντα writing σχόλια για τον
// παίκτη, εισάγουμε νέο writing σχόλιο.

if (@mysqli_affected_rows($globals->db) < 1) {
	$query = "INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`) " .
		"VALUES (" . $globals->pektis->slogin . ", " . $trapezi . ", '" .
		$globals->asfales($sxolio) . "')";
	$globals->sql_query($query);
}

Sizitisi::set_dirty(FALSE, $trapezi);
if ($trapezi == "NULL") {
	if ($globals->is_trapezi() && $globals->trapezi->is_pektis()) {
		Sizitisi::set_dirty(FALSE, $globals->trapezi->kodikos);
	}
}
$globals->klise_fige();

function check_trapezi() {
	global $globals;

	if ($globals->not_trapezi()) {
		$globals->klise_fige();
	}

	if ($globals->trapezi->is_theatis() && (!$globals->trapezi->is_prosklisi())) {
		$globals->klise_fige();
	}
}
