<?php
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
Page::stylesheet('adia/adia');
Page::body();
Page::epikefalida(Globals::perastike('pedi'));
?>
<div class="adiaArea">
<div class="adiaTitlos">
	<span class="data">Δικαιώματα και άδεια χρήσης</span>
</div>
<p class="adiaKimeno">
	Το πρόγραμμα του διαδικτυακού καφενείου της πρέφας
	αναπτύχθηκε εξ ολοκλήρου με προγραμματιστικά εργαλεία
	ανοικτού κώδικα. Πιο συγκεκριμένα, η ανάπτυξη
	έγινε σε <a target="_blank" href="http://www.linux.org/">Linux</a>
	(<a target="_blank" href="http://www.centos.org/">CentOS</a>)
	και χρησιμοποιήθηκε η γλώσσα
	<a target="_blank" href="http://www.php.net/">PHP</a>
	για τα προγράμματα που εκτελούνται στον server,
	ενώ για τα προγράμματα στους clients χρησιμοποιήθηκε η γλώσσα
	<a target="_blank" href="http://www.ecmascript.org/">Javascript</a>.
	Στην καρδιά του συστήματος βρίσκεται η βάση δεδομένων
	του διαδικτυακού καφενείου, για το στήσιμο
	και το χειρισμό της οποίας χρησιμοποιήθηκε η
	<a target="_blank" href="http://www.mysql.com/">MySQL</a>.
</p>
<p class="adiaKimeno">
	Οι εξαιρετικές εικόνες των παιγνιοχάρτων είναι από το site
	<a target="_blank" href="http://www.jfitz.com/cards/">jfitz.com</a>,
	ενώ τα περισσότερα από τα εικονίδια που χρησιμοποιούνται
	στο διαδικτυακό καφενείο της πρέφας κατέβηκαν από το site
	<a target="_blank" href="http://www.iconfinder.com/">www.iconfinder.com</a>
	και, σε όσα από αυτά χρειάστηκε, η επεξεργασία τους έγινε
	με τον <a target="_blank" href="http://www.gimp.org/">GIMP</a>.
	Σε ό,τι αφορά στους ήχους, χρησιμοποιήθηκε η βιβλιοθήκη
	<a target="_blank" href="http://www.schillmania.com/">SoundManager2</a>
	του Scott Schiller, με ήχους που κατέβηκαν από το site
	<a target="_blank" href="http://www.grsites.com/">GRSites</a>,
	από το οποίο επίσης κατέβηκε και το κομφετί που
	συνθέτει το default background pattern.
	Το όλο project συντηρείται με το
	<a target="_blank" href="http://mercurial.selenic.com/">Mercurial</a>
	SCM, ενώ ως κεντρικό repository χρησιμοποιείται το project
	<a target="_blank" href="http://code.google.com/p/prefadoros/"
		style="font-style: italic;">prefadoros</a>,
	που φιλοξενείται απο το
	<a target="_blank" href="http://code.google.com/hosting/">Google code</a>.
</p>
<p class="adiaKimeno">
	Η άδεια χρήσης, αντιγραφής και τροποποίησης του προγράμματος
	εμπίπτει μάλλον στα πλαίσια της
	<a target="_blank" href="http://www.gnu.org/licenses/agpl.html">AGPL</a>,
	καθώς αυτό επιτάσσουν οι άδειες των εργαλείων που χρησιμοποιήθηκαν.
	Πάντως, το θέμα της άδειας χρήσης, αντιγραφής και τροποποίησης
	του προγράμματος είναι ακόμη ασαφές και μέχρι να ολοκληρωθεί
	η πρώτη σταθερή έκδοση του προγράμματος, απαγορεύεται ρητά η τροποποίηση
	και διασπορά του κώδικα καθ' οιονδήποτε τρόπο. Απαγορεύεται, επίσης,
	η καθ' οιονδήποτε τρόπο εκμετάλλευση του προγράμματος με στόχο
	τον προσπορισμό οικονομικού ή άλλου οφέλους από οποιονδήποτε χωρίς
	την έγγραφη άδεια του ιδιοκτήτη.
</p>
<p class="adiaKimeno">
	Θα ήταν, όμως, άδικο να μην αναφερθώ σε όλους αυτούς που με
	τον έναν ή τον άλλο τρόπο με βοήθησαν στην ανάπτυξη και στη
	βελτίωση του προγράμματος.
	Πράγματι, το διαδικτυακό καφενείο της πρέφας δεν θα είχε υλοποιηθεί
	χωρίς την παρότρυνση και την αμέριστη στήριξη των φίλων και της
	παρέας της ζωντανής πρέφας: Χρήστος Μασούρας, Ιγνάτης Μαυρομάτης,
	Αχιλλέας Πέττας, Αχιλλέας Μένος, Τάσος Βασιλόπουλος, Γιάννης
	Γκατζώλης. Σημαντικό, όμως, ρόλο στην ανάπτυξη του εγχειρήματος
	έπαιξε και ο φίλος μαθηματικός
	και μπριτζέρ, Θοδωρής Ανδριόπουλος, ο οποίος, χωρίς να το γνωρίζει
	ο ίδιος, μου έδωσε την αφορμή να ασχοληθώ εκ νέου με το πρόγραμμα,
	καθώς στην προσπάθειά μου να υλοποιήσω διαδικτυακά τις πρωτότυπες
	ιδέες του πάνω στην διδασκαλία των μαθηματικών, αναγκάστηκα να
	ανατρέξω σε παλαιότερα δικά μου σκαριφήματα που αφορούσαν στο
	παιχνίδι της πρέφας, η κατάληξη των οποίων ήταν το πρόγραμμα του
	διαδικτυακού καφενείου της πρέφας.
</p>
<p class="adiaKimeno">
	Ευχαριστώ, επίσης, τον κομμωτή μου και απόφοιτο
	του τμήματος πληροφορικής του ανοικτού πανεπιστημίου
	της Πάτρας, Παναγιώτη Λάσκαρη, καθώς ο ενθουσιασμός του
	αποτέλεσε για μένα το καλύτερο κίνητρο να ασχοληθώ με
	ένα πρόγραμμα γεμάτο προκλήσεις για μια ακόμη φορά.
	Τέλος, ευχαριστώ θερμά τον πρώην συνάδελφο και διαπρεπή
	μαθηματικό, Γιάννη Ανδρεάδη, για την πολύτιμη βοήθειά του
	σε ό,τι αφορά στην κατοχύρωση του domain name και στη φιλοξενία του
	παιχνιδιού σε δικό του server συντελώντας με τον τρόπο
	αυτό στην αξιοπρεπή συμπεριφορά του προγράμματος.
	Από τα τέλη Αυγούστου 2011 ο «Πρεφαδόρος» φιλοξενείται, πλέον,
	σε δικό του server, στα έξοδα του οποίου μπορεί
	οποιοσδήποτε να <a href="<?php print $globals->server;
	?>dorea/index.php">συνεισφέρει</a>.
</p>
<p class="adiaKimeno" style="text-align: right; font-style: italic;">
	Πάνος Παπαδόπουλος, Θεσσαλονίκη 1 Οκτωβρίου 2011
</p>
</div>
<?php
Page::close();
$globals->klise_fige();
?>
