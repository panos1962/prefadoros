<?php
require_once 'lib/standard.php';
set_globals(TRUE);
Page::head('Πρεφαδόρος &mdash; Σφάλμα');
Page::stylesheet('lib/error');
Page::body();
?>
<div class="mainArea" style="margin-left: 1.0cm; max-width: 20.0cm;">
<div class="sfalma">
<?php
print (Globals::perastike('minima') ? $_REQUEST['minima'] : 'Άγνωστο σφάλμα');
?>
</div>
<p>
Τα προβλήματα που αντιμετωπίζετε είναι πιθανόν να οφείλονται σε αλλαγές
που έχουν γίνει στο πρόγραμμα και δεν έχετε παραλάβει ακόμη, καθώς
ο φυλλομετρητής σας (browser) ίσως να χρησιμοποιεί παλαιότερες
εκδοχές που έχει αποθηκεύσει την προσωρινή μνήμη (cache memory).
</p>
<p>
Προκειμένου να παραλάβετε την τελευταία εκδοχή του προγράμματος,
«<a href="http://www.wikihow.com/Clear-Your-Browser's-Cache">καθαρίστε</a>»
την προσωρινή μνήμη του φυλλομετρητή σας αφού πρώτα
κλείσετε την καρτέλα του «Πρεφαδόρου».
</p>
</div>
<?php
Page::close();
$globals->klise_fige();
?>
