<?php
require_once '../lib/standard.php';
Page::data();
Globals::perastike_check('whlt');
$_SESSION['ps_whlt'] = $_REQUEST['whlt'];
?>
