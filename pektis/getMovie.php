<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$query = "SELECT `movietime`, `moviescale` FROM `pektis` WHERE `login` = " .
	$globals->pektis->slogin . " LIMIT 1";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if ($row) {
	print "Movie.realTime=" . ($row[0] == "REAL" ? "true" : "false") . ";";
	print "Movie.timeScale=" . $row[1] . ";";
}
$globals->klise_fige();
?>
