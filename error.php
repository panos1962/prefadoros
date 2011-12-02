<?php
require_once 'lib/standard.php';
set_globals(TRUE);
Page::head('Πρεφαδόρος &mdash; Σφάλμα');
Page::stylesheet('lib/error');
Page::body();
?>
<div class="mainArea">
<div class="sfalma">
<?php
print (Globals::perastike('minima') ? $_REQUEST['minima'] : 'Άγνωστο σφάλμα');
?>
</div>
</div>
<?php
Page::close();
$globals->klise_fige();
?>
