<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Prefadoros::pektis_check();

print "{";

$query = "";
$query .= parse_partida();

print "partida:[";
select_partida($query);
print "],ok:true}";

function parse_partida() {
	global $globals;

	$query = "";
	if (!Globals::perastike('partida')) { return $query; }
	$partida = trim($_REQUEST['partida']);
	if ($partida == "") { return; }

	$tmima = explode(",", $partida);
	$n = count($tmima);
	for ($i = 0; $i < $n; $i++) {
		$tmima[$i] = trim($tmima[$i]);
		if ($tmima[$i] == "") { continue; }

		if ($query != "") { $query .= " OR"; }
		else { $query .= " AND ("; }

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

	if ($query != "") { $query .= ")"; }
	return $query;
}

function select_partida($query) {
	global $globals;

	if ($query == "") { return; }

	$query = "SELECT * FROM `trapezi` WHERE 1" . $query;
	$result = $globals->sql_query($query);
	$koma = "";
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		print $koma . "{k:" . $row['kodikos'] .
			",p1:'" . $row['pektis1'] .
			"',p2:'" . $row['pektis2'] .
			"',p3:'" . $row['pektis3'] .
			"'}";
		$koma = ",";
	}
}

function lathos_kritiria($s) {
	die("error:'" . addslashes($s) . "}");
}
?>
