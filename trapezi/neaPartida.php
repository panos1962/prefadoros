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

Prefadoros::klidose_trapezi();

$query = "DELETE FROM `dianomi` WHERE `trapezi` = " . $globals->trapezi->kodikos;
$globals->sql_query($query);
if (@mysqli_affected_rows($globals->db) <= 0) {
	Prefadoros::xeklidose_trapezi(FALSE);
	die("Δεν διεγράφησαν διανομές");
}

Prefadoros::xeklidose_trapezi(TRUE);
?>
