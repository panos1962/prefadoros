<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();
Prefadoros::pektis_check();
Globals::perastike_check('pektis');
$pektis = "'" . $globals->asfales($_REQUEST['pektis']) . "'";
sleep(2);

$ip = NULL;
$query = "SELECT `ip` FROM `sinedria` WHERE `pektis` LIKE " . $pektis .
	" ORDER BY `kodikos` DESC LIMIT 1";
$result = @mysqli_query($globals->db, $query);
if ($result) {
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if ($row) {
		@mysqli_free_result($result);
		$ip = $row[0];
	}
	else {
		$query = "SELECT `ip` FROM `sinedria_log` WHERE `pektis` LIKE " . $pektis .
		" ORDER BY `kodikos` DESC LIMIT 1";
		$result = @mysqli_query($globals->db, $query);
		if ($result) {
			$row = @mysqli_fetch_array($result, MYSQLI_NUM);
			if ($row) {
				@mysqli_free_result($result);
				$ip = $row[0];
			}
		}
	}
}

if (!isset($ip)) {
	die('Δεν υπάρχουν πληροφορίες θέσης για τον παίκτη "' .  $pektis . '"');
}

print 'OK@' . $ip;
?>
