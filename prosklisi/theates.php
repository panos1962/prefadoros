<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
if ($globals->trapezi->theatis) {
	die('Δεν μπορείτε να αποστείλετε προσκλήσεις ως θεατής');
}

$query = "INSERT INTO `prosklisi` (`pios`, `pion`, `trapezi`) " .
	"SELECT " . $globals->pektis->slogin . ", `pektis`, " .
	$globals->trapezi->kodikos . " FROM `theatis` WHERE `trapezi` = " .
	$globals->trapezi->kodikos;
@mysqli_query($globals->db, $query);
$globals->klise_fige();
