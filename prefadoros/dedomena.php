<?php
header('Content-type: application/json; charset=utf-8');
global $no_session;
$no_session = TRUE;
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::pektis_check();

for ($i = 0; $i < 3; $i++) {
	sleep(1);
	$x = file_get_contents('../dedomena/' . $globals->pektis->login);
	if (preg_match("/^panos/", $x)) {
		break;
	}
}

$id = mt_rand();
print <<<DOC
data: {
	pektis:		'{$globals->pektis->login}',
	id:		{$id}
DOC;

print <<<DOC
}
DOC;
die('@OK');
?>
