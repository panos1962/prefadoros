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
	die("Δεν μπορείτε να εισαγάγετε κινήσεις ως θεατής");
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

Prefadoros::klidose_trapezi();

switch ($idos) {
case 'ΜΠΑΖΑ':
	check_baza($dianomi);
	break;
case 'ΔΙΑΝΟΜΗ':
	check_dianomi($dianomi);
	break;
case 'ΑΓΟΡΑ':
	check_agora($dianomi);
	break;
case 'ΔΗΛΩΣΗ':
	$data = check_trito_paso($dianomi, $data);
	break;
case 'ΤΖΟΓΟΣ':
	$data = fila_tzogou($dianomi);
	break;
case 'ΠΛΗΡΩΜΗ':
	kane_pliromi($dianomi, $data);
	break;
}


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

// Σε περίπτωση που εισάγουμε κίνηση τύπου "ΔΗΛΩΣΗ" και αυτή είναι πάσο,
// τότε ελέγχουμε αν πρόκειται για το τρίτο πάσο και σ'αυτήν την περίπτωση
// προσθέτουμε στα δεδομένα και τα φύλλα του τζόγου ώστε να τα παραλάβουν
// οι clients και να μπορέσουν να τα προβάλουν.

function check_trito_paso($dianomi, $data) {
	global $globals;

	if (!preg_match("/^P/", $data)) {
		return $data;
	}

	$tzogos = "";
	$paso_count = 0;
	$query = "SELECT `είδος`, `data` FROM `κίνηση` WHERE `διανομή` = " . $dianomi;
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		switch ($row[0]) {
		case 'ΔΙΑΝΟΜΗ':
			$x = explode(":", $row[1]);
			$tzogos = $x[0];
			break;
		case 'ΔΗΛΩΣΗ':
			if (preg_match("/^P/", $row[1])) {
				$paso_count++;
			}
			break;
		}
	}

	return ($paso_count < 2 ? $data : $data . ":" . $tzogos);
}

function kane_pliromi($dianomi, $data) {
	global $globals;

	$posa = explode(':', $data);
	if (count($posa) != 7) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die($data . ': λανθασμένα data πληρωμής');
	}

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
	$data1 = '';
	for ($i = 0; $i < 6; $i++) {
		$data1 .= ":" . $row[$i];
	}

	if ($data1 != $data) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απέτυχε η πληρωμή της διανομής');
	}
}

function check_baza($dianomi) {
	global $globals;

	// Η προηγούμενη (τελευταία) κίνηση πρέπει να είναι
	// τύπου "ΦΥΛΛΟ". Ψάχνουμε, λοιπόν, το είδος της
	// τελευταίας κίνησης της διανομής.
	$last = '';
	$query = "SELECT `είδος` FROM `κίνηση` WHERE `διανομή` = " .
		$dianomi . " ORDER BY `κωδικός` DESC LIMIT 1";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$prev = $row[0];
	}
	if ($prev != 'ΦΥΛΛΟ') {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απόπειρα μπάζας μετά από "'. $prev . '"');
	}
}

function check_dianomi($dianomi) {
	global $globals;

	// Πρέπει να είναι η πρώτη κίνηση της διανομής.
	$found = FALSE;
	$query = "SELECT `κωδικός` FROM `κίνηση` WHERE `διανομή` = " .
		$dianomi . " LIMIT 1";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$found = TRUE;
	}
	if ($found) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απόπειρα διπλοδιανομής');
	}
}

function check_agora($dianomi) {
	global $globals;

	// Αν το τραπέζι έχει ΠΠΠ πρέπει να προηγούνται τρεις
	// δηλώσεις πάσο, αλλιώς πρέπει να προηγείται κίνηση
	// τύπου "ΤΖΟΓΟΣ".
	$paso = 0;
	$last = '';
	$query = "SELECT `είδος`, `data` FROM `κίνηση` WHERE `διανομή` = " .
		$dianomi . " ORDER BY `κωδικός`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$last = $row[0];
		if (($last == 'ΔΗΛΩΣΗ') && preg_match('/^P/', $row[1])) {
			$paso++;
		}
	}

	if ($globals->trapezi->ppp == 1) {
		if ($paso >= 3) {
			return;
		}
	}
	elseif ($last == 'ΤΖΟΓΟΣ') {
		return;
	}

	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απόπειρα διπλής αγοράς');
}

?>
