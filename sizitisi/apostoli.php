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

// Μας έχει έρθει σχόλιο για καταχώρηση (παράμετρος "sxolio")
// και μαζί μάς έχει έρθει και παράμετρος "pk" με τιμή "P",
// ή "K" ανάλογα με το αν πρόκειται για σχόλιο που αφορά
// στο τραπέζι, ή στη δημόσια συζήτηση αντίστοιχα.

switch ($pk = Globals::perastike_check('pk')) {
case 'P':
	check_trapezi();
	$trapezi = $globals->trapezi->kodikos;
	break;
case 'K':
	$trapezi = "NULL";
	break;
default:
	$globals->klise_fige('Ακαθόριστο τραπέζι/καφενείο');
}

@mysqli_autocommit($globals->db, FALSE);

Sizitisi::cleanup_writing();

$sxolio = Globals::perastike_check('sxolio');
$query = "INSERT INTO `sizitisi` (`pektis`, `trapezi`, `sxolio`) " .
	"VALUES (" . $globals->pektis->slogin . ", " . $trapezi . ", '" .
	$globals->asfales($sxolio) . "')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	@mysqli_rollback($globals->db);
	$globals->klise_fige('Απέτυχε η εισαγωγή σχολίου');
}
$kodikos = @mysqli_insert_id($globals->db);

Sizitisi::set_dirty(TRUE, $trapezi);
if ($trapezi == "NULL") {
	if ($globals->is_trapezi() && $globals->trapezi->is_pektis()) {
		Sizitisi::set_dirty(FALSE, $globals->trapezi->kodikos);
	}
}

@mysqli_commit($globals->db);
$globals->klise_fige($kodikos . "@OK");

function check_trapezi() {
	global $globals;

	if ($globals->not_trapezi()) {
		$globals->klise_fige();
	}

	if ($globals->trapezi->is_theatis() && (!$globals->trapezi->is_prosklisi()) &&
		($globals->pektis->login != 'panos')) {
		$globals->klise_fige('Δεν έχετε προσκληθεί στη συζήτηση αυτού του τραπεζιού');
	}
}
