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
Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
if ($dianomi != Globals::perastike_check('dianomi')) {
	die('Λάθος διανομή πληρωμής');
}

$pliromi = Globals::perastike_check('pliromi');
$posa = explode(':', $pliromi);
if (count($posa) != 7) {
	die($pliromi . ': λανθασμένα data πληρωμής');
}

Prefadoros::klidose_trapezi();

$query = "UPDATE `διανομή` SET " .
	"`κάσα1` = " . $posa[1] . ", `μετρητά1` = " . $posa[2] . ", " .
	"`κάσα2` = " . $posa[3] . ", `μετρητά2` = " . $posa[4] . ", " .
	"`κάσα3` = " . $posa[5] . ", `μετρητά3` = " . $posa[6] . " " .
	"WHERE `κωδικός` = " . $dianomi;
$globals->sql_query($query);

$query = "SELECT `κάσα1`, `μετρητά1`, `κάσα2`, `μετρητά2`, `κάσα3`, `μετρητά3` " .
	"FROM `διανομή` WHERE `κωδικός` = " . $dianomi;
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
$pliromi1 = '';
for ($i = 0; $i < 6; $i++) {
	$pliromi1 .= ":" . $row[$i];
}

if ($pliromi1 != $pliromi) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η πληρωμή της διανομής');
}

Prefadoros::xeklidose_trapezi(TRUE);

?>
