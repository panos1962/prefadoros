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
		img.src = '<?php print $server; ?>notpps2.png';
		img.style.width = '5.2cm'
		var x = document.getElementById('lezanda');
		if (x) { x.innerHTML = 'Μπορούν να γίνουν χειρότερα!'; }
	}, 3000);
}
//]]>
</script>
</head>
<body>
<img src="<?php print $server; ?>notpps1.png" style="width: 3.6cm;"
	onload="alagiIkonas(this);" />
<div id="lezanda">Τα πράγματα πάνε στραβά;</div>
</body>
</html>
