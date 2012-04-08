<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

if (!($fsize = filesize($fname = "../motto/motto.txt"))) {
	$globals->klise_fige();
}

$fh = fopen($fname, "r");
if (!$fh) {
	$globals->klise_fige();
}

$text = "";
$author = "";
$buffer = "";

$tixeo = mt_rand(0, $fsize);
if (fseek($fh, $tixeo) != 0) {
	rewind($fh);
	fread($fh, $tixeo);
}

$mode = 0;
while ($line = fgets($fh)) {
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

$text = addslashes($text);
$author = addslashes($author);
$buffer = addslashes($buffer);

print "{text:'" . $text . "',author:'" . $author . "',buffer:'" . $buffer . "'}";
$globals->klise_fige();
?>
