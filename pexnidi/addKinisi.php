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
	$globals->klise_fige("Δεν μπορείτε να εισαγάγετε κινήσεις ως θεατής");
}

Prefadoros::dianomi_check();
$dianomi = $globals->dianomi[count($globals->dianomi) - 1]->kodikos;
if ($dianomi != Globals::perastike_check('dianomi')) {
	$globals->klise_fige('Λάθος διανομή κίνησης');
}

$idos = Globals::perastike_check('idos');
$data = Globals::perastike_check('data');
if (Globals::perastike('thesi')) {
	$thesi = $_REQUEST['thesi'];
}
else {
	$thesi = $globals->trapezi->thesi;
}

switch ($thesi = (int)$thesi) {
case 0:
case 1:
case 2:
case 3:
	break;
default:
	$globals->klise_fige('Λάθος θέση παίκτη');
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
	$data = check_trito_paso($dianomi, $data, $thesi);
	break;
case 'ΤΖΟΓΟΣ':
	$data = fila_tzogou($dianomi);
	break;
case 'ΣΥΜΜΕΤΟΧΗ':
	check_simetoxi($dianomi);
	break;
case 'ΠΛΗΡΩΜΗ':
	kane_pliromi($dianomi, $data);
	break;
}


$query = "INSERT INTO `kinisi` (`dianomi`, `pektis`, `idos`, `data`) " .
	"VALUES (" . $dianomi . ", " . $thesi . ", '" .
	$globals->asfales($idos) . "', '" . $globals->asfales($data) . "')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	$globals->klise_fige('Απέτυχε η εισαγωγή κίνησης');
}

print "OK@" . @mysqli_insert_id($globals->db);

Prefadoros::xeklidose_trapezi(TRUE);
$globals->klise_fige();

function fila_tzogou($dianomi) {
	global $globals;

	$query = "SELECT `data` FROM `kinisi` WHERE (`dianomi` = " .
		$dianomi . ") AND (`idos` = 'ΔΙΑΝΟΜΗ')";
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige('Δεν βρέθηκε κίνηση αγοράς για τη διανομή ' . $dianomi);
	}

	$x = explode(":", $row[0]);
	return $x[0];
}

// Σε περίπτωση που εισάγουμε κίνηση τύπου "ΔΗΛΩΣΗ" και αυτή είναι πάσο,
// τότε ελέγχουμε αν πρόκειται για το τρίτο πάσο και σ'αυτήν την περίπτωση
// προσθέτουμε στα δεδομένα και τα φύλλα του τζόγου ώστε να τα παραλάβουν
// οι clients και να μπορέσουν να τα προβάλουν.
//
// Παράλληλα ελέγχω για διπλοδηλώσεις, δηλαδή να μην περαστεί η δήλωση
// του παίκτη δύο φορές, π.χ. από διπλό κλικ. Αυτό γίνεται με έλεγχο
// της τελευταίας δήλωσης, όπου πρέπει ο παίκτης να μην είναι ο ίδιος.

function check_trito_paso($dianomi, $data, $pektis) {
	global $globals;

	$tzogos = "";
	$paso_count = 0;
	$pektis_telefteas_dilosis = 0;
	$paso_pektis = array(TRUE, FALSE, FALSE, FALSE);

	$query = "SELECT `idos`, `data`, `pektis` FROM `kinisi` " .
		"WHERE `dianomi` = " . $dianomi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$row[2] = (int)$row[2];		// just to be sure
		switch ($row[0]) {
		case 'ΔΙΑΝΟΜΗ':
			$x = explode(":", $row[1]);
			$tzogos = $x[0];
			break;
		case 'ΔΗΛΩΣΗ':
			$pektis_telefteas_dilosis = $row[2];
			if (Prefadoros::is_dilosi_paso($row[1])) {
				$paso_pektis[$row[2]] = TRUE;
				$paso_count++;
			}
			break;
		}
	}

	// Ελέγχω τώρα μήπως επαναλαμβάνεται δήλωση από τον ίδιο παίκτη.
	if ($pektis == $pektis_telefteas_dilosis) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige('Απόπειρα διπλοδήλωσης');
	}

	// Αν πρόκειται για δήλωση πάσο, ελέγχω αν έχω ήδη δύο προηγούμενα
	// πάσο. Αν, όντως, έχω δύο προηγούμενα πάσο, τότε στα δεδομένα
	// της δήλωσης θα "κολλήσω" και τα φύλλα του τζόγου, ώστε να
	// είναι εύκολα τα αποκαλυπτήρια. Πρώτα, όμως, ελέγχω μην τυχόν
	// και έχω δεύτερο πάσο από παίκτη που έχει ήδη δηλώσει πάσο.
	if (Prefadoros::is_dilosi_paso($data)) {
		if ($paso_pektis[$pektis]) {
			Prefadoros::xeklidose_trapezi(FALSE);
			$globals->klise_fige('Απόπειρα διπλοδήλωσης πάσο');
		}

		if ($paso_count >= 2) {
			$data .= ":" . $tzogos;
		}
	}

	return($data);
}

// Εάν έχει ήδη δηλωθεί συμμετοχή "ΜΑΖΙ" από κάποιον παίκτη, τότε δεν
// γίνεται δεκτή οποιαδήποτε άλλη δήλωση συμμετοχής.

function check_simetoxi($dianomi) {
	global $globals;

	$mazi = FALSE;
	$query = "SELECT `pektis` FROM `kinisi` WHERE (`dianomi` = " .
		$dianomi . ") AND (`idos` = 'ΣΥΜΜΕΤΟΧΗ') AND (`data` = 'ΜΑΖΙ')";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$mazi = TRUE;
	}

	if ($mazi) {
		$globals->klise_fige('Απόπειρα συμμετοχής μετά από "ΜΑΖΙ"');
	}
}

function kane_pliromi($dianomi, $data) {
	global $globals;

	$posa = explode(':', $data);
	if (count($posa) != 7) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige($data . ': λανθασμένα data πληρωμής');
	}

	$query = "UPDATE `dianomi` SET " .
		"`kasa1` = " . $posa[1] . ", `metrita1` = " . $posa[2] . ", " .
		"`kasa2` = " . $posa[3] . ", `metrita2` = " . $posa[4] . ", " .
		"`kasa3` = " . $posa[5] . ", `metrita3` = " . $posa[6] . " " .
		"WHERE `kodikos` = " . $dianomi;
	$globals->sql_query($query);

	$query = "SELECT `kasa1`, `metrita1`, `kasa2`, `metrita2`, `kasa3`, `metrita3` " .
		"FROM `dianomi` WHERE `kodikos` = " . $dianomi;
	$result = $globals->sql_query($query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	$data1 = '';
	for ($i = 0; $i < 6; $i++) {
		$data1 .= ":" . $row[$i];
	}

	if ($data1 != $data) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige('Απέτυχε η πληρωμή της διανομής');
	}

	// Καλού κακού ενημερώνω την πίστωση του τραπεζιού, δηλαδή
	// το σύνολο των καπικιών που έχουν αναληφθεί από τις μέχρι
	// τώρα διανομές (μαζί με την τελευταία που μόλις εισήγαγα).
	$query = "UPDATE `trapezi` SET `pistosi` = (SELECT SUM(`kasa1` + `kasa2` + `kasa3`) / 10 " .
		"FROM `dianomi` WHERE `trapezi` = " . $globals->trapezi->kodikos .
		") WHERE `kodikos` = " . $globals->trapezi->kodikos;
	$result = $globals->sql_query($query);
}

function check_baza($dianomi) {
	global $globals;

	// Η προηγούμενη (τελευταία) κίνηση πρέπει να είναι
	// τύπου "ΦΥΛΛΟ". Ψάχνουμε, λοιπόν, το είδος της
	// τελευταίας κίνησης της διανομής.
	$last = '';
	$query = "SELECT `idos` FROM `kinisi` WHERE `dianomi` = " .
		$dianomi . " ORDER BY `kodikos` DESC LIMIT 1";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$prev = $row[0];
	}
	if ($prev != 'ΦΥΛΛΟ') {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige('Απόπειρα μπάζας μετά από "'. $prev . '"');
	}
}

function check_dianomi($dianomi) {
	global $globals;

	// Πρέπει να είναι η πρώτη κίνηση της διανομής.
	$found = FALSE;
	$query = "SELECT `kodikos` FROM `kinisi` WHERE `dianomi` = " .
		$dianomi . " LIMIT 1";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$found = TRUE;
	}
	if ($found) {
		Prefadoros::xeklidose_trapezi(FALSE);
		$globals->klise_fige('Απόπειρα διπλοδιανομής');
	}
}

function check_agora($dianomi) {
	global $globals;

	// Αν το τραπέζι έχει ΠΠΠ πρέπει να προηγούνται τρεις
	// δηλώσεις πάσο, αλλιώς πρέπει να προηγείται κίνηση
	// τύπου "ΤΖΟΓΟΣ".
	$paso = 0;
	$last = '';
	$query = "SELECT `idos`, `data` FROM `kinisi` WHERE `dianomi` = " .
		$dianomi . " ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$last = $row[0];
		if (($last == 'ΔΗΛΩΣΗ') && Prefadoros::is_dilosi_paso($row[1])) {
			$paso++;
		}
	}

	if ($last == 'ΤΖΟΓΟΣ') {
		return;
	}

	if (($globals->trapezi->ppp == 1) && ($paso >= 3)) {
		return;
	}

	Prefadoros::xeklidose_trapezi(FALSE);
	$globals->klise_fige('Απόπειρα διπλής αγοράς');
}

?>
