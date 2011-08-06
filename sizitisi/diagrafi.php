<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$trapezi = vres_trapezi();

$query = "DELETE FROM `συζήτηση` WHERE (`τραπέζι` = " . $trapezi . ")";
if (!Globals::perastike('delall')) {
	$query .= " ORDER BY `κωδικός` DESC LIMIT 1";
}
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) < 1) {
	die('Δεν έγινε διαγραφή');
}

function vres_trapezi() {
	global $globals;
	Prefadoros::trapezi_check();
	if ($globals->trapezi->is_theatis() &&
		(!$globals->trapezi->is_prosklisi())) {
			die('Δεν έχετε δικαίωμα παρέμβασης στη συζήτηση');
	}
	return $globals->trapezi->kodikos;
}
