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

Prefadoros::klidose_trapezi();

$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
	") AND (`idos` = 'ΑΚΥΡΩΣΗ')";
$globals->sql_query($query);

$query = "DELETE FROM `kinisi` WHERE (`dianomi` = " . $dianomi .
	") AND (`idos` NOT = 'ΔΙΑΝΟΜΗ') ORDER BY `kodikos` DESC LIMIT 1";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(TRUE);
	die('Δεν υπάχει κίνηση προς ακύρωση');
}

$query = "INSERT INTO `kinisi` (`dianomi`, `pektis`, `idos`, `data`) " .
	"VALUES (" . $dianomi . ", " . $globals->trapezi->thesi . ", 'ΑΚΥΡΩΣΗ', '')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η ακύρωση κίνησης');
}

Prefadoros::xeklidose_trapezi(TRUE);
