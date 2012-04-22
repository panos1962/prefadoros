<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once 'photo.php';

define('MAX_USERS', 60);

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
	$globals->asfales($_REQUEST['login']) . "' AND `password` = BINARY '" .
	$globals->asfales(sha1($_REQUEST['password'])) . "'";
$result = $globals->sql_query($query);
$row = @mysqli_fetch_array($result, MYSQLI_NUM);
if (!$row) {
	$globals->klise_fige("Access denied");
}

if (count(Prefadoros::energos_pektis()) > MAX_USERS) {
	$globals->klise_fige("Έχει δημιουργηθεί αδιαχώρητο στον «Πρεφαδόρο», δοκιμάστε πάλι αργότερα…");
}
	
check_pektis_photo($_REQUEST['login']);
Prefadoros::set_trapezi_dirty();
@mysqli_free_result($result);
$_SESSION['ps_login'] = $row[0];
$_SESSION['ps_paraskinio'] = $row[1];
?>
