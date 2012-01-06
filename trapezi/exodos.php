<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
Prefadoros::trapezi_check();
Prefadoros::klidose_trapezi();
Prefadoros::xeklidose_trapezi(Prefadoros::exodos());
$globals->klise_fige();
?>
