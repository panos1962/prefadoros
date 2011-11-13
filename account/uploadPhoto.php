<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Page::head();
Page::body();
Prefadoros::pektis_check();

if ((!is_array($_FILES)) || (!array_key_exists('photoFile', $_FILES)) ||
	(!is_array($_FILES['photoFile'])) || (!array_key_exists('tmp_name', $_FILES['photoFile'])))
		die("Δεν περάστηκε αρχείο εικόνας");

// Θα ανιχνεύσουμε τώρα τον τύπο του αρχείου εικόνας. Οι επιτρεπτοί τύποι
// αρχείου εικόνας είναι: jpeg, jpg, png και gif.

$name_parts = explode('.', $_FILES['photoFile']['name']);
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

$ikona = "../photo/" . strtolower(substr($globals->pektis->login, 0, 1)) .
	"/" . $globals->pektis->login . "." . $tipos;

if(!move_uploaded_file($_FILES['photoFile']['tmp_name'], $ikona))
	die("Σφάλμα κατά τη μεταφόρτωση του αρχείου εικόνας.");

?>
<script type="text/javascript">
//<![CDATA[
var x = window.parent;
if (isSet(x) && isSet(x.location) && isSet(x.location.href)) {
	setTimeout(function() {
		x.location.href = globals.server + 'account/signup.php?modify';
	}, 500);
}
//]]>
</script>
<?php
Page::close();
?>
