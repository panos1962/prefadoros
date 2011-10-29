<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

global $error;
$error = "";

Prefadoros::pektis_check();

print "{";

$query = "";
$query .= parse_partida();

print "partides:[";
select_partida($query);
print "],ok:true}";
die(0);

function parse_partida() {
	global $globals;
	global $error;

	$query = "";
	if (!Globals::perastike('partida')) {
		return $query;
	}

	$partida = $_REQUEST['partida'];
	if ($partida == "") {
		return;
	}

	$tmima = explode(",", $partida);
	$n = count($tmima);
	for ($i = 0; $i < $n; $i++) {
		if ($query != "") {
			$query .= " OR";
		}
		else {
			$query .= " AND (";
		}

		$query .= " (`kodikos` ";
		if (preg_match("/^[0-9]+$/", $tmima[$i])) {
			$query .= "= " . $tmima[$i] . ")";
		}
		elseif (preg_match("/^[0-9]+\\-[0-9]+$/", $tmima[$i])) {
			$ipotmima = explode("-", $tmima[$i]);
			$query .= "BETWEEN " . $ipotmima[0] . " AND " . $ipotmima[1] . ")";
		}
		else {
			lathos_kritiria($partida . ": λανθασμένα κριτήρια παρτίδας");
		}
	}

	if ($query != "") {
		$query .= ")";
	}

	return $query;
}

function select_partida($query) {
	if ($query == "") {
		return;
	}

	$query = "SELECT * FROM `trapezi` WHERE 1" . $query;
}

function lathos_kritiria($s) {
	die("error:'" . addslashes($s) . "}");
}
?>
