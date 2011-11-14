<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->is_theatis()) {
	die('Δεν μπορείτε να αλλάξετε τη διάταξη των παικτών ως θεατής');
}

// Με το παρόν αλλάζουμε τη διάταξη των παικτών. Αυτό μπορεί να γίνει
// για δύο λόγους και σε διαφορετικές φάσεις της παρτίδας.
//
// Κατά το στήσιμο
// ---------------
// Εκεί οι παίκτες μπορούν κάνουν αλλαγές στη διάταξη, παραμένοντας στην
// ίδια θέση και εναλλάσσοντας τους άλλους δυο παίκτες μεταξύ τους.
// Αυτή είναι η default λειτουργία του προγράμματος.
//
// Κατά την είσοδο νέου παίκτη
// ---------------------------
// Αν κάποιοι παίκτες αποχωρήσουν και επανέλθουν αργότερα, ή έρθουν νέοι
// παίκτες να συνεχίσουν στη θέση τους, υπάρχει περίπτωση να τοποθετηθούν
// σε λάθος θέση. Τότε μπορούν να πατήσουν το πλήκτρο αλλαγής διάταξης
// και να μετακινηθούν στην επόμενη ελεύθερη θέση. Αυτή η λειτουργία
// ενεργοποιείται με το πέρασμα της παραμέτρου "alagi=yes".

Prefadoros::klidose_trapezi();

if (Globals::perastike('alagi')) {
	switch ($ena = $globals->trapezi->thesi) {
	case 1:
	case 2:
	case 3:		break;
	default:	die('Ακαθόριστη θέση παίκτη');
	}

	$max = $ena + 3;
	for ($i = $ena + 1; $i < $max; $i++) {
		$dio = ($i > 3) ? ($i - 3) : $i;
		$pektis2 = "pektis" . $dio;
		if ($globals->trapezi->$pektis2 == '') {
			break;
		}
	}
	if ($i == $max) { die('Δεν υπάρχει κενή θέση'); }
	$errmsg = 'Δεν έγινε αλλαγή θέσης';
}
else {
	switch ($globals->trapezi->thesi) {
	case 1:		$ena = 2; $dio = 3; break;
	case 2:		$ena = 1; $dio = 3; break;
	case 3:		$ena = 1; $dio = 2; break;
	default:	die('Ακαθόριστη θέση παίκτη');
	}
	$errmsg = 'Δεν έγινε αλλαγή στη διάταξη των παικτών';
}

$pektis1 = "pektis" . $ena;
$pektis1 = $globals->trapezi->$pektis1;
if ($pektis1 == '') { $pektis1 = 'NULL'; }
else { $pektis1 = "'" . $globals->asfales($pektis1) . "'"; }

$pektis2 = "pektis" . $dio;
$pektis2 = $globals->trapezi->$pektis2;
if ($pektis2 == '') { $pektis2 = 'NULL'; }
else { $pektis2 = "'" . $globals->asfales($pektis2) . "'"; }

$query = "UPDATE `trapezi` SET `pektis" . $ena . "` = " . $pektis2 .
	", `apodoxi" . $ena . "` = 'NO', `pektis" . $dio . "` = " .
	$pektis1 . ", `apodoxi" . $dio . "` = 'NO' " .
	"WHERE `kodikos` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die($errmsg);
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
