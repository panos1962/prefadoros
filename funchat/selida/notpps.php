<?php
$server = $_REQUEST['server'];
if (!isset($server)) { die(0); }
?>
<html>
<head>
<script type="text/javascript">
//<![CDATA[
function alagiIkonas(img) {
	setTimeout(function() {
		img.style.width = '5.2cm'
		img.setAttribute('src', '<?php print $server; ?>notpps2.png');
		var x = document.getElementById('lezanda');
		if (x) { x.innerHTML = 'Μπορούν να γίνουν χειρότερα!'; }
	}, 5000);
}
//]]>
</script>
</head>
<body style="overflow: hidden;">
<img src="<?php print $server; ?>notpps1.png" style="width: 3.6cm;"
	onload="alagiIkonas(this);" />
<div id="lezanda">Τα πράγματα πάνε στραβά;</div>
</body>
</html>
