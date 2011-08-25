<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

// Τεχνητή καθυστέρηση για τις δοκιμές στο τοπικό.
if (preg_match("@^http://127@", $globals->server)) {
	usleep(500000);
}

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->is_theatis()) {
	die("Δεν μπορείτε να εισάγετε κινήσεις ως θεατής");
}

Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
if ($dianomi != Globals::perastike_check('dianomi')) {
	die('Λάθος διανομή κίνησης');
}

$idos = Globals::perastike_check('idos');
$data = Globals::perastike_check('data');
if (Globals::perastike('thesi')) {
	$thesi = $_REQUEST['thesi'];
}
else {
	$thesi = $globals->trapezi->thesi;
}

switch ($idos) {
case 'ΤΖΟΓΟΣ':
	$data = fila_tzogou($dianomi);
	break;
}

Prefadoros::klidose_trapezi();

$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
	"VALUES (" . $dianomi . ", " . $thesi . ", '" .
	$globals->asfales($idos) . "', '" . $globals->asfales($data) . "')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η εισαγωγή κίνησης');
}

print "OK@" . @mysqli_insert_id($globals->db);

Prefadoros::xeklidose_trapezi(TRUE);

function fila_tzogou($dianomi) {
	global $globals;

	$query = "SELECT `data` FROM `κίνηση` WHERE (`διανομή` = " .
		$dianomi . ") AND (`είδος` LIKE 'ΔΙΑΝΟΜΗ')";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Δεν βρέθηκε κίνηση αγοράς για τη διανομή ' . $dianomi);
	}

	$x = explode(":", $row[0]);
	return $x[0];
}
?>
