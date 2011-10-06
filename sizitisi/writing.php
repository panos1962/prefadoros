<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
switch ($pk = Globals::perastike_check('pk')) {
case 'P':
	$trapezi = vres_trapezi();
	$sxolio = "@WP@";
	break;
case 'K':
	$trapezi = "NULL";
	$sxolio = "@WK@";
	break;
default:
	Sizitisi::cleanup_writing();
	die(0);
}

// Πρώτα δοκιμάζουμε να ενημερώσουμε τυχόν υπάρχοντα writing
// σχόλια για τον παίκτη.
$prosfata = time() - WRITING_CLEANUP;
$query = "UPDATE `sizitisi` SET `sxolio` = '" . $globals->asfales($sxolio) .
 	"', `trapezi` = " . $trapezi . " WHERE (`pektis` LIKE " .
	$globals->pektis->slogin . ") AND (`sxolio` REGEXP '^@W[PK]@$') " .
	"AND (UNIX_TIMESTAMP(`pote`) > " . $prosfata . ")";
@mysqli_query($globals->db, $query);
if (@mysqli_affected_rows($globals->db) > 0) { die(0); }

// Εφόσον δεν ενημερώθηκαν υπάρχοντα writing σχόλια για τον
// παίκτη, εισάγουμε νέο writing σχόλιο.
$query = "INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`) " .
	"VALUES (" . $globals->pektis->slogin . ", " . $trapezi . ", '" .
	$globals->asfales($sxolio) . "')";
$globals->sql_query($query);

function vres_trapezi() {
	global $globals;
	Prefadoros::trapezi_check();
	if ($globals->trapezi->is_theatis() && (!$globals->trapezi->is_prosklisi())) {
		die(0);
	}
	return $globals->trapezi->kodikos;
}
