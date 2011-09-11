<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::set_pektis();
if (!Globals::perastike('offlineOnly')) {
	unset($_SESSION['ps_login']);
}

if (isset($globals->pektis->login)) {
	$query = "UPDATE `pektis` SET `poll` = DATE_SUB(NOW(), INTERVAL " .
		XRONOS_PEKTIS_IDLE_MAX . " SECOND) WHERE `login` LIKE " .
		$globals->pektis->slogin;
	$globals->sql_query($query);
	Sizitisi::cleanup_writing();
}

// Μια στις 20 φορές σβήσε τις παλιές συνεδρίες.
if (mt_rand(0, 20) == 0) {
	$query = "DELETE FROM `sinedria` WHERE `dimiourgia` < DATE_SUB(NOW(), INTERVAL 1 DAY)";
	$globals->sql_query($query);
}
?>
