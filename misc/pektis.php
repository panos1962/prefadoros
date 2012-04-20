<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../lib/trapoula.php';
require_once '../prefadoros/prefadoros.php';
require_once '../account/photo.php';
set_globals();
$energos = Prefadoros::energos_pektis();
print count($energos);

Page::head();
Page::stylesheet('prefadoros/prefadoros');
Page::javascript('lib/soundmanager');
?>
</head>
<body>
AAA
</body>
</html>
<?php
$globals->klise_fige();
