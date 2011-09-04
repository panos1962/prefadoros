<?php
require_once '../lib/standard.php';
require_once '../lib/trapoula.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/kinisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();

$thesi = Globals::perastike_check('thesi');
$pektis = "pektis" . $thesi;
if ((!isset($globals->trapezi->$pektis)) ||
	($globals->trapezi->$pektis != $globals->pektis->login)) {
	die('Λάθος θέση παίκτη');
}

Prefadoros::klidose_trapezi();

if (Globals::perastike('apodoxi')) {
	$nea = $_REQUEST['apodoxi'];

	$query = "UPDATE `τραπέζι` SET `αποδοχή" . $thesi . "` = '" .
		$globals->asfales($nea) . "' WHERE `κωδικός` = " .
		$globals->trapezi->kodikos;
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απέτυχε η αλλαγή αποδοχής');
	}

	$apodoxi = "apodoxi" . $thesi;
	$globals->trapezi->$apodoxi = ($nea == "YES");

	$count = 0;
	for ($i = 1; $i <= 3; $i++) {
		$apodoxi = "apodoxi" . $i;
		if ($globals->trapezi->$apodoxi) {
			$count++;
		}
	}

	// Αν και οι τρεις παίκτες έχουν κάνει αποδοχή των όρων
	// του τραπεζιού, γίνεται η πρώτη διανομή από τυχαίο dealer.
	if ($count >= 3) {
		kane_dianomi(mt_rand(1, 3));
	}
}
else if (Globals::perastike('dianomi')) {
	// Τεχνητή καθυστέρηση για τις δοκιμές στο τοπικό.
	if (preg_match("@^http://127@", $globals->server)) {
		usleep(500000);
	}
	kane_dianomi(find_the_dealer());
}

Prefadoros::xeklidose_trapezi(TRUE);

function kane_dianomi($dealer) {
	global $globals;

	$trapoula = new Trapoula();
	$trapoula->anakatema();

	$query = "INSERT INTO `διανομή` (`τραπέζι`, `dealer`) VALUES " .
		"(" . $globals->trapezi->kodikos . ", " . $dealer . ")";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die("Απέτυχε η διανομή");
	}
	$dianomi = @mysqli_insert_id($globals->db);

	// Εισάγεται κίνηση διανομής με data της μορφής:
	//
	//	ΖΖ:ΠΠΠΠΠΠΠΠΠΠ:ΔΔΔΔΔΔΔΔΔΔ:ΤΤΤΤΤΤΤΤΤΤ
	//
	// όπου "ΖΖ" είναι τα φύλλα του τζόγου και "ΠΠΠΠΠΠΠΠΠΠ", "ΔΔΔΔΔΔΔΔΔΔ",
	// "ΤΤΤΤΤΤΤΤΤΤ" είναι τα φύλλα του πρώτου, δεύτερου και τρίτου παίκτη
	// αντίστοιχα.

	$data = $trapoula->fila[30] . $trapoula->fila[31];
	for ($i = 0; $i < 3; $i++) {
		$data .= ":";
		$apo = $i * 10;
		$eos = $apo + 10;
		for ($j = $apo; $j < $eos; $j++) {
			$data .= $trapoula->fila[$j];
		}
	}

	Kinisi::insert($dianomi, $dealer, "ΔΙΑΝΟΜΗ", $data);
}

function find_the_dealer() {
	global $globals;

	// Προσπελαύνω την τελευταία (προηγούμενη) διανομή.
	$dealer = 0;
	$query = "SELECT `κωδικός`, `dealer` FROM `διανομή` WHERE `τραπέζι` = " .
		$globals->trapezi->kodikos . " ORDER BY `κωδικός` DESC LIMIT 1";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$dianomi = $row[0];
		$dealer = $row[1];
	}

	if ($dealer == 0) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Ακαθόριστος dealer προηγούμενης διανομής');
	}

	// Στην προηγούμενη διανομή πρέπει να έχουν γίνει τουλάχιστον
	// τρεις δηλώσεις.
	$dilosi = 0;
	$query = "SELECT `κωδικός` FROM `κίνηση` WHERE (`διανομή` = " .
		$dianomi . ") AND (`είδος` = 'ΔΗΛΩΣΗ')";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$dilosi++;
	}

	if ($dilosi < 3) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απόπειρα διπλοδιανομής');
	}

	// Καθορίζουμε τον dealer της διανομής που θα γίνει να είναι
	// ο επόμενος της τελευταίας (προηγούμενης) διανομής.
	$dealer++;
	if ($dealer > 3) {
		$dealer = 1;
	}
	return($dealer);
}

?>
