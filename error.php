<?php
header('Content-Type: text/html; charset=UTF-8');
require_once 'lib/standard.php'
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="Διαδικτυακή πρέφα" />
<meta name="keywords" content="<?php print 'πρέφα, χαρτοπαίγνιο, ' .
	'πρεφαδόρος, ατού, αγορά, μπάζα, μπάζες, σόλο, σολαρία, ' .
	'κάσα, καπίκι, καπίκια'; ?>" />
<title>Πρεφαδόρος</title>
<link rel="stylesheet" type="text/css" href="lib/standard.css" />
<script type="text/javascript">
	//<![CDATA[
	globals = {};
	globals.server = 'http://127.0.0.1/prefadoros/';
	globals.timeDif = <?php print time(); ?>;
	//]]>
</script>
<script type="text/javascript" src="lib/standard.js"></script>
</head>

<body>
<div class="testBoxArea">
	<span onclick="testAjax(1)" class="testBox" >Test1</span>
</div>
<div class="testBoxArea">
	<span onclick="testAjax(2)" class="testBox" >Test2</span>
</div>
Ok!
<div id="info">
</div>
</body>
</html>
