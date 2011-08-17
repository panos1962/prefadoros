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

if (($idos == "ΔΗΛΩΣΗ") && preg_match("/^[PD]/", $data)) {
	check_paso($dianomi);
}

print "OK@" . @mysqli_insert_id($globals->db);

Prefadoros::xeklidose_trapezi(TRUE);

function check_paso($dianomi) {
	global $globals;

	$dilosi = array(FALSE, FALSE, FALSE, FALSE);
	$paso = array('', '', '', '');
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
				$dilosi[$row['παίκτης']] = substr($row['data'], 1, 2);
			}
			break;
		case 'ΔΙΑΝΟΜΗ':
			$data_dianomis = $row['data'];
			break;
		}
	}

	$tzogadoros = NULL;
	$paso_count = 0;
	for ($thesi = 1; $thesi <= 3; $thesi++) {
		if ($paso[$thesi]) {
			$paso_count++;
		}
		else if ($dilosi[$thesi]) {
			$tzogadoros = $thesi;
		}
	}

	if ($paso_count < 2) {
		return;
	}

	if (!isset($tzogadoros)) {
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
?>
