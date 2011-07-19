<?php
header('Content-type: text/plain; charset=utf-8');
global $no_session;
$no_session = TRUE;
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/sxesi.php';
require_once '../prefadoros/permes.php';
require_once '../prefadoros/trapezi.php';
require_once '../prefadoros/dedomena.php';
require_once '../prefadoros/prefadoros.php';
set_globals();

global $id;
$id = Globals::perastike_check('id');

Prefadoros::pektis_check();
$globals->pektis->poll_update($id);

if (Globals::perastike('freska')) {
	freska_dedomena(torina_dedomena());
	telos_ok();
}

$prev = new Dedomena();
if (!$prev->diavase()) {
	freska_dedomena(torina_dedomena());
	telos_ok();
}

$ekinisi = time();
do {
	check_neotero_id();
	$curr = torina_dedomena();
	if ($curr != $prev) {
		diaforetika_dedomena($curr, $prev);
		telos_ok();
	}

	if ((time() - $ekinisi) > XRONOS_DEDOMENA_MAX) {
		break;
	}
	usleep(XRONOS_DEDOMENA_TIC);
} while (TRUE);

print_epikefalida();
print ",same:true}";
telos_ok();

function check_neotero_id() {
	global $globals;
	global $id;
	$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

	$query = "SELECT `ενημέρωση` FROM `παίκτης` " .
		"WHERE `login` LIKE " . $slogin;
	$result = $globals->sql_query($query);
	$row = mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		Globals::fatal('ακαθόριστος παίκτης');
	}

	mysqli_free_result($result);
	if ($row[0] !== $id) {
		print_epikefalida();
		print ",akiro:true}";
		telos_ok();
	}
}

function print_epikefalida() {
	global $id;

	header('Content-type: application/json; charset=utf-8');
	print "data:{id:{$id}";
}

function telos_ok() {
	die('@OK');
}
?>
