<!DOCTYPE HTML>
<html>

<head>
<?php
if (!isset($_REQUEST)) { die(0); }
if (!is_array($_REQUEST)) { die(0); }

if (!array_key_exists("video", $_REQUEST)) { die(0); }
$video = $_REQUEST["video"];
$x = explode(".", $video);
if (count($x) < 2) { die(0); }
switch ($x[count($x) - 1]) {
case "mp4":
	$tipos = "mp4";
	break;
default:
	die(0);
}

$width = array_key_exists("width", $_REQUEST) ? $_REQUEST["width"] : "7.6";
$height = array_key_exists("height", $_REQUEST) ? $_REQUEST["height"] : "5.7";
?>
</head>

<body style="margin: 0px; overflow: hidden;">
<video style="width: <?php print $width; ?>cm; height: <?php
	print $height; ?>cm; margin: 0px; " autoplay="autoplay">
	<source src="<?php print $video; ?>" type="video/<?php print $tipos; ?>" />
	<?php
	if (!array_key_exists("ikona", $_REQUEST)) {
		print $_REQUEST["ikona"];
	}
	?>
</video>
</body>

</html>
