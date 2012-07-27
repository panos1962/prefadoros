<?php
require_once '../lib/standard.php';
Page::data();
set_globals(TRUE);

$list = scandir("../images/gallery");
if ($list === FALSE) { die(0); }
if (($n = count($list)) < 1) { die(0); }

$koma = "";
for ($i = 0; $i < $n; $i++) {
	if (preg_match("/\.(jpg|gif|png)$/i", $list[$i])) {
		print $koma . "'" . $list[$i] . "'";
		$koma = ",";
	}
}
?>
