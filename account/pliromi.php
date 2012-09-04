<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();
Prefadoros::pektis_check();

$ores = $globals->pektis->total_xronos() / 3600;
$pliromi = $globals->pektis->total_pliromi();
$pliromi = 1000;
$kostos = $ores * AXIA_ORAS;
printf("max:" . MAX_USERS .",ores:'%.2f',axia:" . AXIA_ORAS . ",kostos:'%.2f'", $ores, $kostos / 100);
if ($pliromi > 0) {
	printf(",pliromi:'%.2f'", $pliromi / 100);
}
if ($globals->pektis->superuser) {
	print ",su:1";
}
else {
	printf(",ipolipo:'%.2lf'", ($kostos - $pliromi) / 100);
}
$globals->klise_fige();
?>
