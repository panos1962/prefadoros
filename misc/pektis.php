<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::set_pektis();
Page::head();
?>
<style type="text/css">
.pektis {
	position: relative;
	margin-bottom: 0.1cm;
	max-width: 16.0cm;
	font-size: 0.4cm;
	font-weight: bold;
	color: #193A59;
}

.busy {
	opacity: 0.6;
	filter: alpha(opacity=60);
}

.filos {
	color: #007700;
}

.block {
	color: #990000;
}

.onoma {
	margin-left: 0.4cm;
	color: #333333;
	font-style: italic;
}
</style>
<?php
Page::javascript('misc/pektis');
Page::javascript('lib/soundmanager');
?>
</head>
<body>
<div>
<input type="text" style="width: 10.0cm;" />
</div>
<div id="pektis">
</div>
</body>
</html>
<?php
$globals->klise_fige();
