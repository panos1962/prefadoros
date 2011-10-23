<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
Page::data();
set_globals();

if (!$fsize = filesize($fname = "../motto/motto.txt")) {
	die(0);
}

$fh = fopen($fname, "r");
if (!$fh) {
	die(0);
}
fread($fh, mt_rand(0, $fsize));

$text = "";
$author = "";
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
		$author .= preg_replace("/^:|[\r\n]/", "", $line);
		continue;
	}

	if ($text != "") { $text .= "<br />"; }
	$text .= preg_replace("/[\r\n]/", "", $line);
}
fclose($fh);

$text = addslashes($text);
$author = addslashes($author);

print "{text:'" . $text . "',author:'" . $author . "'}";
?>
