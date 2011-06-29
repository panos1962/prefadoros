<?php
require_once 'lib/standard.php';
set_globals();
Page::head('Πρεφαδόρος &mdash; Σφάλμα');
Page::body();
?>
<div class="sfalma">
<?php
print (Globals::perastike('minima') ? $_REQUEST['minima'] : 'Άγνωστο σφάλμα');
?>
</div>
<?php
Page::close();
?>
