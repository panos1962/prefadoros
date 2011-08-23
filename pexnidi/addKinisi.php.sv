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

$idos = Globals::perastike_check('idos');
$data = Globals::perastike_check('data');

Prefadoros::klidose_trapezi();

$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
	"VALUES (" . $dianomi . ", " . $thesi . ", '" .
	$globals->asfales($idos) . "', '" . $globals->asfales($data) . "')";
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) != 1) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die('Απέτυχε η εισαγωγή κίνησης');
}

switch ($idos) {
case "ΔΗΛΩΣΗ":
	check_paso($dianomi);
	break;
case "ΦΥΛΛΟ":
	check_baza($dianomi, $data);
	break;
}

print "OK@" . @mysqli_insert_id($globals->db);

Prefadoros::xeklidose_trapezi(TRUE);

function check_paso($dianomi) {
	global $globals;

	$dilosi = array("", "", "", "");
	$paso = array(FALSE, FALSE, FALSE, FALSE);
	$data_dianomis = NULL;

	$query = "SELECT * FROM `κίνηση` WHERE `διανομή` = " .
		$dianomi . " ORDER BY `κωδικός`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		switch ($row['είδος']) {
		case 'ΔΗΛΩΣΗ':
			if (preg_match("/^P/", $row['data'])) {
				$paso[$row['παίκτης']] = TRUE;
			}
			else if (preg_match("/^[DE]/", $row['data'])) {
				$dilosi[$row['παίκτης']] = $row['data'];
			}
			else {
				Prefadoros::xeklidose_trapezi(FALSE);
				die("Λανθασμένα δεδομένα δήλωσης (κίνηση " . $row['κωδικός'] . ")");
			}
			break;
		case 'ΔΙΑΝΟΜΗ':
			$data_dianomis = $row['data'];
			break;
		}
	}

	$paso_count = 0;
	$tzogadoros = 0;
	$tagrafo = 0;

	for ($thesi = 1; $thesi <= 3; $thesi++) {
		if ($paso[$thesi]) {
			$paso_count++;
		}
		else if ($dilosi[$thesi] == "DTG") {
			$tagrafo = $thesi;
		}
		else if ($dilosi[$thesi] != "") {
			$tzogadoros = $thesi;
		}
	}

	if ($tzogadoros != 0) {
		if ($tagrafo != 0) {
			$paso[$tagrafo] = TRUE;
			$paso_count++;
		}
	}
	else if ($tagrafo != 0) {
		$tzogadoros = $tagrafo;
	}

	if ($paso_count < 2) {
		return;
	}

	if ($tzogadoros == 0) {
		return;
	}

	if (!isset($data_dianomis)) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Δεν βρέθηκε κίνηση διανομής');
	}

	$x = explode(":", $data_dianomis);
	if (count($x) != 4) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Λανθασμένα δεδομένα κίνησης διανομής');
	}

	$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
		"VALUES (" . $dianomi . ", " . $tzogadoros . ", 'ΤΖΟΓΟΣ', '" . $x[0] . "')";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απέτυχε εισαγωγή κίνησης τζόγου');
	}
}

function check_baza($dianomi, $filo) {
	global $globals;

	$tzogadoros = 0;
	$simetoxi = array("", "", "", "");
	$baza_filo = array();
	$baza_pektis = array();
	$filo_count = 0;

	$query = "SELECT * FROM `κίνηση` WHERE `διανομή` = " .
		$dianomi . " ORDER BY `κωδικός`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		switch ($row['είδος']) {
		case 'ΑΓΟΡΑ':
			$xroma_agoras = substr($row['data'], 1, 1);
			$tzogadoros = $row['παίκτης'];
			break;
		case 'ΣΥΜΜΕΤΟΧΗ':
			$simetoxi[$row['παίκτης']] = $row['data'];
			break;
		case 'ΦΥΛΛΟ':
			$baza_filo[] = $row['data'];
			$baza_pektis[] = $row['παίκτης'];
			$filo_count++;
			break;
		case 'ΜΠΑΖΑ':
			$baza_filo = array();
			$baza_pektis = array();
			$filo_count = 0;
			break;
		}
	}

	switch ($tzogadoros) {
	case 1:
		$ena = 2;
		$dio = 3;
		break;
	case 2:
		$ena = 3;
		$dio = 1;
		break;
	default:
		$ena = 1;
		$dio = 2;
		break;
	}

	if (($simetoxi[$ena] == 'ΠΑΣΟ') || ($simetoxi[$dio] == 'ΠΑΣΟ')) {
		$baza_filo_count = 2;
	}
	else {
		$baza_filo_count = 3;
	}

	if ($filo_count < $baza_filo_count) {
		return;
	}

	$xroma_bazas = substr($baza_filo[0], 0, 1);
	$max_rank = Prefadoros::rank($baza_filo[0]);
	$perni = 0;
	$tsaka = FALSE;

	for ($i = 1; $i < $filo_count; $i++) {
		$xroma_filo = substr($baza_filo[$i], 0, 1);
		if ($xroma_filo == $xroma_bazas) {
			if ($tsaka) {
				continue;
			}

			$rank = Prefadoros::rank($baza_filo[$i]);
			if ($rank > $max_rank) {
				$max_rank = $rank;
				$perni = $i;
			}
			continue;
		}

		if ($xroma_filo == $xroma_agoras) {
			if (!$tsaka) {
				$tsaka = TRUE;
				$max_rank = Prefadoros::rank($baza_filo[$i]);
				$perni = $i;
				continue;
			}

			$rank = Prefadoros::rank($baza_filo[$i]);
			if ($rank > $max_rank) {
				$max_rank = $rank;
				$perni = $i;
			}
			continue;
		}
	}

	$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
		"VALUES (" . $dianomi . ", " . $baza_pektis[$perni] . ", 'ΜΠΑΖΑ', '')";
	$globals->sql_query($query);
	if (@mysqli_affected_rows($globals->db) != 1) {
		Prefadoros::xeklidose_trapezi(FALSE);
		die('Απέτυχε η εισαγωγή κίνησης τύπου μπάζας');
	}
}
?>
