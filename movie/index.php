<?php
require_once '../lib/standard.php';
set_globals();
$trapezi = Globals::perastike_check('trapezi');
Page::head();
Page::stylesheet('movie/movie');
Page::javascript('movie/movie');
Page::body();
print $trapezi;
?>
</body>
</html>
