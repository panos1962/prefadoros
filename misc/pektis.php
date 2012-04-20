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
	margin-bottom: 0.2cm;
	max-width: 16.0cm;
	font-weight: bold;
}

.busy {
	opacity: 0.5;
	filter: alpha(opacity=50);
}

.filos {
	color: green;
}

.block {
	color: red;
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
