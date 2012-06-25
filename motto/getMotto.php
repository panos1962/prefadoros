<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

$fname = Globals::perastike("arxio") ? $_REQUEST["arxio"] : "../motto/motto.txt";
if (!($fsize = @filesize($fname))) { $globals->klise_fige($fname . ": δεν υπάρχει το αρχείο"); }
$fh = anixe_arxio($fname);

$tixeo = mt_rand(0, $fsize);
// Υπάρχει περίπτωση το "fseek" να μην υποστηρίζεται στο Λ.Σ. του server,
// οπότε το κάνουμε εμμέσως.
if (fseek($fh, $tixeo) != 0) {
	fclose($fh);
	$fh = anixe_arxio($fname);
	fread($fh, $tixeo);
}

$pass = 1;
SCAN_FILE:
$mode = 0;
$text = "";
$author = "";
$buffer = "";
while ($line = diavase_grami($fh)) {
	if (preg_match("/^#[\r\n]/", $line)) {
		if ($mode != 0) {
			break;
		}

		$mode = 1;
		continue;
	}

	if ($mode == 0) {
		continue;
	}

	if (preg_match("/^[@?]/", $line)) {
		continue;
	}


	if (preg_match("/^:/", $line)) {
		if ($author != "") { $author .= "<br />"; }
		$t = preg_replace("/^:|[\r\n]/", "", $line);
		$author .= $t;
		$buffer .= '<div style="margin-top: 0.1cm; font-style: italic; ' .
			'color: #DC143C; text-align: right;">' . $t . '</div>';
		continue;
	}

	if ($text != "") { $text .= "<br />"; }
	$text .= preg_replace("/[\r\n]/", "", $line);
	$buffer .= preg_replace("/[\r\n]/", " ", $line);
}
fclose($fh);

if ($text == "") {
	if ($pass < 2) {
		$pass++;
		$text = "";
		$author = "";
		$buffer = "";
		$mode = 0;
		$fh = anixe_arxio($fname);
		goto SCAN_FILE;
	}

	$text = "ERROR";
}

$text = addslashes($text);
$author = addslashes($author);
$buffer = addslashes($buffer);

print "{text:'" . $text . "',author:'" . $author . "',buffer:'" . $buffer . "'}";
$globals->klise_fige();

function anixe_arxio($fname) {
	$fh = @fopen($fname, "r");
	if (!$fh) { $globals->klise_fige($fname . ": δεν βρέθηκε το αρχείο"); }
	return($fh);
}

function diavase_grami($fh) {
	$buf = "";
	while (($l = fgets($fh)) !== FALSE) {
		if (preg_match("/\\\[\r\n]*$/", $l)) {
			$buf .= preg_replace("/\\\[\r\n]*$/", "\n", $l);
		}
		else {
			$buf .= $l;
			return($buf);
		}
	}

	return(FALSE);
}
?>
