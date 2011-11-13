<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Page::head();
Page::body();
Prefadoros::pektis_check();

if ((!is_array($_FILES)) || (!array_key_exists('photo', $_FILES)) ||
	(!is_array($_FILES['photo'])) || (!array_key_exists('tmp_name', $_FILES['photo'])))
		die("Δεν περάστηκε αρχείο εικόνας");

$upload_dir = "../upload";

// Θα ανιχνεύσουμε τώρα τον τύπο του αρχείου εικόνας. Οι επιτρεπτοί τύποι
// αρχείου εικόνας είναι: jpeg, jpg, png και gif.

$name_parts = explode('.', $_FILES['photo']['name']);
switch ($tipos = strtolower($name_parts[count($name_parts) - 1])) {
case 'jpeg':
	$tipos = 'jpg';
case 'jpg':
	break;
default:
	die('Το αρχείο εικόνας πρέπει να φέρει παρέκταμα jpg');
}

// Ήρθε η στιγμή της μεταφόρτωσης του αρχείου από την προσωρινή του θέση στο
// directory "upload".

$ikona = $upload_dir . $globals->pektis->login . "." . $tipos;

if(!move_uploaded_file($_FILES['photo']['tmp_name'], $ikona))
	die("Σφάλμα κατά τη μεταφόρτωση του αρχείου εικόνας.");

Page::close();
?>
