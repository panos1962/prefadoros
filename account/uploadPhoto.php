<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Page::head();
Page::body();
Prefadoros::pektis_check();

if ((!is_array($_FILES)) || (!array_key_exists('photoFile', $_FILES)) ||
	(!is_array($_FILES['photoFile'])) ||
	(!array_key_exists('tmp_name', $_FILES['photoFile'])) ||
	(!array_key_exists('size', $_FILES['photoFile']))) {
		lathos('Δεν περάστηκε αρχείο εικόνας');
}

$max_photo_size = (Globals::perastike('MAX_PHOTO_SIZE') ? $_REQUEST['MAX_PHOTO_SIZE'] : 50000);
if ($_FILES['photoFile']['size'] > $max_photo_size) {
	lathos('Το μέγεθος του αρχείου εικόνας υπερβαίνει το όριο (' . $max_photo_size . ')');
}

// Θα ανιχνεύσουμε τώρα τον τύπο του αρχείου εικόνας. Οι επιτρεπτοί τύποι
// αρχείου εικόνας είναι: jpeg, jpg, png και gif.

$name_parts = explode('.', $_FILES['photoFile']['name']);
switch ($tipos = strtolower($name_parts[count($name_parts) - 1])) {
case 'jpeg':
	$tipos = 'jpg';
case 'jpg':
	break;
default:
	lathos('Το αρχείο εικόνας πρέπει να φέρει παρέκταμα jpg');
}

// Ήρθε η στιγμή της μεταφόρτωσης του αρχείου από την προσωρινή του θέση στο
// directory "photo". Θυμίζουμε ότι τα αρχεία εικόνας φέρουν το όνομα του
// παίκτη με παρέκταμα "jpg" και τοποθετούνται σε subdiretcories με το
// πρώτο γράμμα του παίκτη, π.χ. για τον παίκτη "panos" το αρχείο εικόνας
// θα είναι το "photo/p/panos.jpg".

$basi = "../photo/" . strtolower(substr($globals->pektis->login, 0, 1)) .
	"/" . $globals->pektis->login;
$ikona = $basi . "." . $tipos;
$kopia = $basi . "~." . $tipos;
$aipok = $basi . "~~." . $tipos;

@copy($ikona, $aipok);
@chmod($aipok, 0666);

if(!move_uploaded_file($_FILES['photoFile']['tmp_name'], $ikona)) {
	lathos('Σφάλμα κατά τη μεταφόρτωση του αρχείου εικόνας.');
}

@chmod($ikona, 0666);
if (!@rename($aipok, $kopia)) {
	@copy($ikona, $kopia);
}
@chmod($kopia, 0666);

?>
<script type="text/javascript">
//<![CDATA[
var x = window.parent;
if (isSet(x) && isSet(x.location) && isSet(x.location.href)) {
	x.formaFyi('Μεταφόρτωση αρχείου εικόνας. Παρακαλώ περιμένετε…');
	var img = x.document.getElementById('photo');
	if (isSet(img)) {
		img.src = globals.server + 'images/workingRed.gif';
		img.style.width = '1.0cm';
		img.style.height = '1.0cm';
		img.style.marginTop = '0.6cm';
		img.style.marginRight = '1.6cm';
	}
	setTimeout(function() {
		x.location.href = globals.server + 'account/signup.php?modify';
	}, 2000);
}
//]]>
</script>
<?php
Page::close();

function lathos($message) {
	?>
	<script type="text/javascript">
	//<![CDATA[
	var x = window.parent;
	if (isSet(x)) {
		setTimeout(function() {
			x.formaFyi('<span style="color: ' + globals.color.error +
				';"><?php print $message; ?></span>');
		}, 500);
	}
	//]]>
	</script>
	<?php
	Page::close();
}
?>
