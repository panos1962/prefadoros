<?php
require_once('../lib/standard.php');
set_globals(TRUE);

if (!Globals::perastike('password')) {
	Globals::fatal('password missing');
}

die('access denied');

$_SESSION['ps_administrator'] = 'Yes';
?>
