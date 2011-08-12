<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->is_theatis()) {
	die("Δεν μπορείτε να εισάγετε κινήσεις ως θεατής");
}

Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;

$thesi = $globals->asfales(Globals::perastike_check('thesi'));
if ($thesi != $globals->trapezi->thesi) {
	die("Λάθος θέση παίκτη");
}

$idos = "'" . $globals->asfales(Globals::perastike_check('idos')) . "'";
$data = "'" . $globals->asfales(Globals::perastike_check('data')) . "'";

Prefadoros::klidose_trapezi();

$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
	"VALUES (" . $dianomi . ", " . $thesi . ", " . $idos . ", " . $data . ")";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η εισαγωγή κίνησης');
}
print "OK@" . @mysqli_insert_id($globals->db);

Prefadoros::xeklidose_trapezi(TRUE);
?>
