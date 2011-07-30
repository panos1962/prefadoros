<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

if (!Prefadoros::set_trapezi()) {
	die('Ακαθόριστο τραπέζι');
}

// Αν ο παίκτης συμμετέχει ως θεατής, τότε απλώς παύει να είναι θεατής.
if ($globals->trapezi->simetoxi == 'ΘΕΑΤΗΣ') {
	$query = "DELETE FROM `θεατής` WHERE `παίκτης` LIKE " . $slogin;
	$globals->sql_query($query);
	if (mysqli_affected_rows($globals->db) != 1) {
		print 'Απέτυχε η έξοδος από το τραπέζι ως θεατή';
	}
	die(0);
}

// Επιβεβαιώνουμε ότι ο παίκτης όντως συμμετέχει στο τραπέζι.
$pektis = 'pektis' . $globals->trapezi->thesi;
if ($globals->trapezi->$pektis != $globals->pektis->login) {
	die('Δεν συμμετέχετε στο τραπέζι');
}

Prefadoros::klidose_trapezi();

// Εκκενώνουμε τη θέση του παίκτη στο τραπέζι.
$query = "UPDATE `τραπέζι` SET `παίκτης" . $globals->trapezi->thesi .
	"` = NULL WHERE `κωδικός` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η έξοδος από το τραπέζι ως παίκτη');
}

// Κρατάμε τη θέση στην οποία έπαιζε ο παίκτης στο τραπέζι.
// Καλού κακού διαγράφουμε πρώτα τυχόν άλλη συμμετοχή στην
// ίδια θέση αυτού του τραπεζιού.
$query = "DELETE FROM `συμμετοχή` WHERE (`τραπέζι` = " .
	$globals->trapezi->kodikos . ") AND (`θέση` = " .
	$globals->trapezi->thesi . ")";
$globals->sql_query($query);

$query = "INSERT INTO `συμμετοχή` (`τραπέζι`, `θέση`, `παίκτης`) " .
	"VALUES (" . $globals->trapezi->kodikos . ", " .
	$globals->trapezi->thesi . ", " . $slogin . ")";
$globals->sql_query($query);
if (mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η εισαγωγή συμμετοχής');
}

// Επιχειρούμε να κλείσουμε το τραπέζι, εφόσον όλες οι θέσεις
// είναι πλέον κενές.
$query = "UPDATE `τραπέζι` SET `τέλος` = NOW() " .
	"WHERE (`κωδικός` = " . $globals->trapezi->kodikos .
	") AND (`παίκτης1` IS NULL) AND (`παίκτης2` IS NULL) " .
	"AND (`παίκτης3` IS NULL)";
$globals->sql_query($query);

// Αν δεν ενημερωθεί το τραπέζι σημαίνει ότι δεν έχουν ακόμη
// εκκενωθεί όλες οι θέσεις, οπότε επιστρέφουμε.
if (mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(TRUE);
	die(0);
}

// Το τραπέζι μόλις έχει κλείσει, οπότε επαναφέρω τους τελευταίους
// συμμετέχοντες παίκτες.
$query = "SELECT * FROM `συμμετοχή` WHERE `τραπέζι` = " .
	$globals->trapezi->kodikos;
$result = $globals->sql_query($query);
if (!$result) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('απέτυχε το μάζεμα συμμετοχών');
}

$pektis1 = 'NULL';
$pektis2 = 'NULL';
$pektis3 = 'NULL';
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	$pektis = "pektis" . $row['θέση'];
	$$pektis = "'" . $globals->asfales($row['παίκτης']) . "'";
}

// Αν έχουμε μαζέψει έστω και μια εγγραφή συμμετοχής, προσωρούμε στην
// επανατοποθέτηση των παικτών.
if (($pektis1 != 'NULL') || ($pektis2 != 'NULL') || ($pektis3 != 'NULL')) {
	$query = "UPDATE `τραπέζι` SET `παίκτης1` = " . $pektis1 .
		", `παίκτης2` = " . $pektis2 . ", " .  "`παίκτης3` = " .
		$pektis3 . " WHERE `κωδικός` = " . $globals->trapezi->kodikos;
	$globals->sql_query($query);
	if (mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απέτυχε η επανατοποθέτηση των παικτών');
	}
}

Prefadoros::xeklidose_trapezi(TRUE);

// Το τραπέζι έχει κλείσει και έχει γίνει τυχόν επανατοποθέτηση των
// τελευταίων παικτών, οπότε διαγράφουμε όλες τις περιφερειακές
// εγγραφές που αφορούν στο τραπέζι (συμμετοχές, θεατές, προσκλήσεις).

$query = "DELETE FROM `συμμετοχή` WHERE `τραπέζι` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);

$query = "DELETE FROM `θεατής` WHERE `τραπέζι` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);

$query = "DELETE FROM `πρόσκληση` WHERE `τραπέζι` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
?>
