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
	die('Δεν μπορείτε να κάνετε επανεκκίνηση της παρτίδας ως θεατής');
}

Prefadoros::klidose_trapezi();

$query = "DELETE FROM `dianomi` WHERE `trapezi` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) <= 0) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die("Δεν διεγράφησαν διανομές");
}

// Σ' αυτό το σημείο αποστέλλονται μηνύματα στους παίκτες και
// σε άλλους συμμετέχοντες της παρτίδας ότι κάποιος παίκτης
// έκανε επανεκκίνηση της παρτίδας.

$endiaferomenos = array();
$endiaferomenos[$globals->trapezi->pektis1] = 'pektis';
$endiaferomenos[$globals->trapezi->pektis2] = 'pektis';
$endiaferomenos[$globals->trapezi->pektis3] = 'pektis';

$query = "SELECT `pektis` FROM `simetoxi` WHERE `trapezi` = " . $globals->trapezi->kodikos;
$result = @mysqli_query($globals->db, $query);
if ($result) {
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$endiaferomenos[$row[0]] = 'simetoxi';
	}
}

$apostoleas = "'" . SYSTEM_ACCOUNT . "'";
$minima = "'" . $globals->asfales("Ο παίκτης <strong><em>" . $globals->pektis->login .
	"</em></strong> διέγραψε τις διανομές της <nobr>παρτίδας <strong><em>" .
	$globals->trapezi->kodikos . "</em></strong>.</nobr><hr />" .
	"Παρόμοιο μήνυμα έχει αποσταλεί σε όλους τους συμμετέχοντες.") . "'";
foreach ($endiaferomenos as $paraliptis => $idos) {
	if (($paraliptis = trim($paraliptis)) == '') {
		continue;
	}

	$query = "INSERT INTO `minima` (`apostoleas`, `paraliptis`, `minima`) VALUES (" .
		$apostoleas . ", '" . $globals->asfales($paraliptis) . "', " . $minima . ")";
	@mysqli_query($globals->db, $query);
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
