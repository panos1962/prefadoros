<?php
require_once('../lib/standard.php');
set_globals(FALSE);

if (!Globals::perastike('password')) {
	Globals::fatal('password missing');
}

if (sha1($_REQUEST['password']) != 'bd97b530fc726cdb2b47be246e5e6eb7651c47b3') {
	die('access denied');
}

$_SESSION['ps_administrator'] = 'Yes';
?>
