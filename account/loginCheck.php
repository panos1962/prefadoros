<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
Page::data();
set_globals();

Globals::perastike_check('login');
Globals::perastike_check('password');

// Ο παίκτης μπορεί να δώσει στο login το όνομά του είτε με μικρά,
// είτε με κεφαλαία γράμματα, αλλά το πρόγραμμα θα κρατήσει στο
// session το όνομα όπως αυτό έχει δοθεί κατά την εγγραφή.

$query = "SELECT `login`, `paraskinio` FROM `pektis` WHERE `login` = '" .
	$globals->asfales($_REQUEST['login']) . "' AND `password` COLLATE utf8_bin = '" .
	$globals->asfales(sha1($_REQUEST['password'])) . "'";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if (!$row) {
	die('Access denied');
}

@mysqli_free_result($result);
$_SESSION['ps_login'] = $row[0];
$_SESSION['ps_paraskinio'] = $row[1];
?>
