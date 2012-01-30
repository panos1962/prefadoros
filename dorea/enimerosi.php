<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Prefadoros::set_pektis();
Page::head();
Page::stylesheet('dorea/dorea');
Page::body();
Page::epikefalida(Globals::perastike('pedi'));
?>
<div class="mainArea">
<p class="dexia">
Θεσσαλονίκη, 29 Ιανουαρίου 2012
</p>
<p>
<img src="<?php print $globals->server; ?>dorea/panos.jpg" alt=""
style="width: 3.2cm; float: left; margin-right: 0.4cm; margin-top: 0.2cm;
	border-style: solid; border-width: 2px; border-color: #003300;" />
Κάθε σελίδα που «κατεβάζετε» με το φυλλομετρητή σας από το διαδίκτυο
φτάνει σε σας μέσω ενός παγκόσμιου δικτύου υπολογιστών και επικοινωνιακών
κόμβων. Όλα τα παραπάνω απαιτούν υποδομές, μηχανήματα, ενέργεια, και
εργατοώρες. Από αυτά τίποτε σχεδόν δεν παρέχεται δωρεάν, αλλά υπάρχουν
τεράστια κόστη τα οποία καλύπτονται από εταιρείες ή φυσικά πρόσωπα
που αποκομίζουν οικονομικά οφέλη από τη χρήση του διαδικτύου.
Μια εταιρεία, π.χ. μπορεί μέσω της σελίδας της στο διαδίκτυο να
έχει πολλαπλάσιους πελάτες από όσους θα είχε χωρίς τη χρήση του διαδικτύου,
επομένως κρίνει ότι συμφέρει να πληρώσει όλα εκείνα τα έξοδα που
απαιτούνται για να αναθέσει σε ειδικούς τη δημιουργία της σχετικής
σελίδας και την ανάρτησή της στο διαδίκτυο.
</p>
<p>
Όσο περισσότερες επισκέψεις έχει κάποιος ιστότοπος (πρόκειται για
το σύνολο μηχανημάτων και προγραμμάτων που «σερβίρουν» συγκεριμένες
σελίδες), τόσο περισσότεροι πόροι απαιτούνται για την κάλυψη των
σχετικών απαιτήσεων και συνεπώς το κόστος θα είναι υψηλότερο.
Αν οι σελίδες είναι δυναμικές, δηλαδή ο χρήστης δεν παρατηρεί
απλώς το περιεχόμενο κάποιας σελίδας, αλλά επικοινωνεί μέσω της
σελίδας αυτής με τον ιστότοπο που παρέχει τη συγκεκριμένη σελίδα,
τότε το κόστος ανεβαίνει, καθώς οι σχετικοί servers απασχολούνται
περισσότερο προκειμένου να καλύψουν τις απαιτήσεις αυτές.
Ο «Πρεφαδόρος» είναι, προφανώς, ένας δυναμικός ιστότοπος, καθώς
οι παίκτες επικοινωνούν συνεχώς με τον ιστότοπο της διαδικτυακής
πρέφας και λαμβάνουν διαρκώς νέες πληροφορίες για κάθε αλλαγή
που συμβαίνει τόσο στο καφενείο, όσο και στα συγκεκριμένα τραπέζια
στα οποία συμμετέχουν οι παίκτες.
</p>
<p>
Οι περισσότερες ανάγκες του «Πρεφαδόρου» εξυπηρετούνται από
εικονικό server (cloud hosting) χαμηλών προδιαγραφών που παρέχεται
από ελληνικό data center της Θεσσαλονίκης.
Υπάρχουν και δευτερεύοντα στοιχεία του «Πρεφαδόρου», π.χ.
οι εικόνες του funchat, που εξυπηρετούνται από δωρεάν servers,
προκειμένου να μειώσω το σχετικό κόστος.
Το κόστος του κεντρικού server ανέρχεται περίπου σε 50€
το μήνα και το έχω καταβάλει εγώ προσωπικά μέχρι και τον
Φεβρουάριο του 2012, ενώ έχω κάνει σαφές ότι η εργασία μου
παρέχεται δωρεάν προκειμένου να υλοποιηθεί το παιχνίδι της
πρέφας στο διαδίκτυο με το ελάχιστο δυνατό κόστος.
</p>
<p>
Οι προδιαγραφές του server αρκούν για τις τρέχουσες ανάγκες
του «Πρεφαδόρου», δηλαδή περίπου 10-20 τραπέζια και περίπου
40-50 παίκτες online. Επειδή, όμως, τον τελευταίο καιρό παρατηρείται
μεγάλη αύξηση των επισκέψεων στον ιστότοπο της διαδικτυακής
πρέφας, θα πρέπει η δυναμικότητά του να αυξηθεί προκειμένου
ο ιστότοπος της διαδικτυακής πρέφας να μπορεί να σηκώσει
περισσότερα από 100 τραπέζια.
Μετά από ενδελεχή έρευνα που έχω κάνει τους τελευταίους μήνες,
έχω εξασφαλίσει πολύ καλή προσφορά από αθηναϊκή εταιρεία
για server ικανών προδιαγραφών με περίπου 65€ το μήνα.
Απαιτείται, όμως, η υπαγωγή του «Πρεφαδόρου» σε κάποιο
άλλο σχήμα προκειμένου η μετάβαση και το σχετικό
συμβόλαιο με την εταιρεία να γίνουν με όλες εκείνες
τις διαδικασίες που προβλέπει ο νόμος.
</p>
<p>
Οι λύσεις που παρέχονται είναι δύο. Πιο συγκεκριμένα,
θα πρέπει να ιδρυθεί κάποια εταιρεία η οποία θα αναλάβει τη διαχείριση του
«Πρεφαδόρου», ή να ιδρυθεί κάποιος σύλλογος ή σωματείο
στους κόλπους του οποίου να ενταχθεί και η διαχείριση του
ιστοτόπου. Προσωπικά, προτιμώ τη δεύτερη λύση, π.χ.
ίδρυση ενός «σωματείου φίλων της πρέφας» με την επωνυμία
«Πρεφαδόρος», το οποίο θα αναλάβει την οικονομική διαχείριση του
ιστοτόπου, προκειμένου να υπάρχει διαφάνεια και η απαραίτητη
νομική και φορολογική κάλυψη. Μέχρι να γίνει αυτό, ο «Πρεφαδόρος»
θα παραμείνει στο τρέχον σχήμα για τους αμέσως επόμενους μήνες.
</p>
<p>
Από εισφορές που κατέθεσαν ήδη κάποιοι από τους παίκτες του «Πρεφαδόρου»
έχει μαζευτεί μέχρι σήμερα περίπου το ποσό των 180€. Με αυτό το ποσό μπορεί
να παραταθεί η παραμονή του «Πρεφαδόρου» στον server που μας φιλοξενεί
για περίπου 4 μήνες. Προκειμένου να υπάρξει άνεση χρόνου
για την οποιαδήποτε κίνηση σε κάποια από τις κατευθύνσεις που
ανέπτυξα παραπάνω, κρίνω ότι θα πρέπει να υπάρχει διαθέσιμο ένα
ποσό περίπου 500€ για να μεταβούμε σε server μεγαλύτερης
δυναμικότητας και να καλύψουμε το διάστημα μέχρι το τέλος του 2012.
Για το 2013 θα γίνει νέα ενημέρωση και θα παρθούν νέες αποφάσεις.
Φρονώ ότι ο χρονικός ορίζοντας του Δεκεμβρίου 2012 είναι αρκετός
για να περιγραφεί και να καθοριστεί με σαφήνεια η πορεία του «Πρεφαδόρου» στο μέλλον.
</p>
<p>
Για να συνεισφέρετε στα έξοδα του ιστοτόπου ο μόνος τρόπος ο οποίος
δεν θα μου δημιουργήσει (πιθανόν) μεγάλα προβλήματα με το νόμο και την εφορία
είναι η κατάθεση μικρών δωρεών στο λογαριασμό που άνοιξα στο PayPal
για τις ανάγκες του «Πρεφαδόρου». Για όσους δεν γνωρίζουν, το PayPal
είναι κάποιο είδος διαδικτυακής τράπεζας, όπου μπορεί κανείς
να ανοίξει κάποιο λογαριασμό στον οποίο μπορεί να καταθέσει χρήματα
οποιοσδήποτε διαθέτει πιστωτική κάρτα ή άλλο λογαριασμό PayPal.
Επομένως, για να καταθέσετε κάποια εισφορά για τις ανάγκες του
«Πρεφαδόρου» δεν μπορώ να χρησιμοποιήσω κάποιον κοινό τραπεζικό
λογαριασμό, τουλάχιστον μέχρι να δημιουργηθεί κάποιος φορέας
ο οποίος να αναλάβει την οικονομική διαχείριση του ιστοτόπου.
</p>
<p>
Πολλοί από εσάς εκδήλωσαν τη διάθεσή τους να συνεισφέρουν
κάποιο ποσό για τις ανάγκες του «Πρεφαδόρου», αλλά δεν έχουν
πιστωτική κάρτα ή λογαριασμό PayPal. Επειδή, όπως εξήγησα παραπάνω,
δεν μου είναι εύκολο να ανοίξω κοινό τραπεζικό λογαριασμό,
θα ήθελα όσοι από εσάς θέλετε να καταθέσετε κάποιο ποσό
στο υπάρχοντα λογαριασμό PayPal, να κάνετε το εξής:
Βρείτε κάποιον γνωστό σας που έχει πιστωτική κάρτα και δώστε
του (στο χέρι) το ποσό που επιθυμείτε να καταθέσετε για τον «Πρεφαδόρο».
Κατόπιν, παρουσία του κατόχου της κάρτας, κάντε κλικ στο πλήκτρο [Donate] που βρίσκεται
κάτω αριστερά και συμπληρώστε το ποσό που θέλετε να καταθέσετε
και τα στοιχεία της κάρτας.
Θα ήταν, επίσης, πολύ βοηθητικό να μου γράψετε και το login σας
στο πεδίο σχολίων που παρέχει η φόρμα δωρεάς της PayPal,
ώστε γνωρίζω την ταυτότητά σας καθώς το email που έχετε
δηλώσει στον πρεφαδόρο πιθανόν να μην συμφωνεί με αυτό
που χρησιμοποιείτε στην πληρωμή.
</p>
<p>
Αυτό που μπορώ να εγγυηθώ είναι
η ασφάλεια της διαδικασίας, καθώς όπως θα δείτε από τις σχετικές
διεθύνσεις που εμφανίζονται στο φυλλομετρητή σας, το πλήκτρο
[Donate] σας περνάει σε σελίδα της PayPal και όχι σε σελίδα
του «Πρεφαδόρου», επομένως η ασφάλεια που παρέχεται στη συναλλαγή είναι
η ασφάλεια της PayPal, που θεωρείται μια από τις ασφαλέστερες
μεθόδους συναλλαγής παγκοσμίως.
Εγγυώμαι, επίσης, προσωπικά, ότι όποιο ποσό κατατεθεί στο
λογαριασμό PayPal του «Πρεφαδόρου» θα εκταμιευθεί
για τις ανάγκες του «Πρεφαδόρου» και μόνο γι' αυτές.
Θα κλείσω με έναν πρόχειρο υπολογισμό, όπου η κατάθεση
ποσού 10-20€ από 30-40 παίκτες του «Πρεφαδόρου»
θα αποφέρει έσοδα περίπου 500€.
</p>
<p class="dexia">
Με τιμή, Πάνος Παπαδόπουλος
</p>
</div>
<?php
Page::close();
?>
