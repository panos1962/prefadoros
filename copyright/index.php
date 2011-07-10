<?php
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
Page::stylesheet('copyright/copyright');
Page::body();
Page::epikefalida();
?>
<div class="mainArea copyrightArea">
<div class="copyrightTitlos">
	<span class="data">Copyright statement</span>
</div>
<p class="copyrightKimeno">
	Το πρόγραμμα αναπτύχθηκε τον Μάρτιο του 2011 από τον Πάνο Παπαδόπουλο
	που κατέχει το copyright του προγράμματος και του ιστοτόπου γενικότερα.
	Τα οποιαδήποτε πνευματικά, οικονομικά ή άλλα δικαιώματα ανήκουν στον
	προγραμματιστή και απαγορεύεται ρητά η οποιαδήποτε εμπορική ή άλλη χρήση του προγράμματος
	χωρίς την άδεια του ιδιοκτήτη.
</p>
</div>
<?php
Page::close();
?>
