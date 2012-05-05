<?php
require_once '../lib/standard.php';
Page::data();

if (Globals::session_set('ps_mobile')) {
	unset($_SESSION['ps_mobile']);
	print 'OFF';
}
else {
	$_SESSION['ps_mobile'] = "ON";
	print 'ON';
}
?>
