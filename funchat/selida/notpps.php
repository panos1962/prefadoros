<?php
$server = $_REQUEST['server'];
$funchat = $_REQUEST['funchat'];
if (!isset($server)) { die(0); }
if (!isset($funchat)) { die(0); }
?>
<!DOCTYPE HTML>
<html>
<head>
<script type="text/javascript">
//<![CDATA[
function alagiIkonas(img) {
	setTimeout(function() {
		img.onload = null;
		img.style.width = '5.2cm'
		img.src = '<?php print $funchat; ?>notpps2.png';

		var x = document.getElementById('lezanda');
		if (x) { x.innerHTML = 'Μπορούν να γίνουν χειρότερα!'; }

		x = document.getElementById('ixos');
		if (x) { x.src = '<?php print $server; ?>sounds/fiouit.mp3'; }
	}, 5000);
}
//]]>
</script>
</head>
<body style="overflow: hidden;">
<img src="<?php print $funchat; ?>notpps1.png" style="width: 3.6cm;"
	onload="alagiIkonas(this);" />
<audio id="ixos" autoplay="autoplay">
  <source src="<?php print $server; ?>sounds/doing.mp3" type="audio/mp3" />
</audio>
<div id="lezanda">Τα πράγματα πάνε στραβά;</div>
</body>
</html>
