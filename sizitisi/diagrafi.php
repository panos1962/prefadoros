<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$trapezi = vres_trapezi();

$query = "DELETE FROM `sizitisi` WHERE (`trapezi` = " . $trapezi . ")";
if (!Globals::perastike('delall')) {
	$query .= " AND (`sxolio` NOT REGEXP '^@W[PK]@$') ".
		"ORDER BY `kodikos` DESC LIMIT 1";
}
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) < 1) {
	$globals->klise_fige('Δεν έγινε διαγραφή');
}
Sizitisi::set_dirty();
$globals->klise_fige();

function vres_trapezi() {
	global $globals;
	Prefadoros::trapezi_check();
	if ($globals->trapezi->is_theatis() &&
		(!$globals->trapezi->is_prosklisi())) {
			$globals->klise_fige('Δεν έχετε δικαίωμα παρέμβασης στη συζήτηση');
	}
	return $globals->trapezi->kodikos;
}
