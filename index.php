<?php
require_once 'lib/standard.php';
set_globals();
Page::head();
Page::stylesheet('lib/prefadoros');
Page::javascript('lib/prefadoros');
Page::body();
Page::motd();
Page::diafimisi();
Page::toolbar();
?>
<div class="mainArea">
<?php
if ($globals->is_pektis()) {
	prefadoros();
}
else {
	welcome();
}
?>
</div>
<?php
Page::close();

function prefadoros() {
	global $globals;
	?>
	<table class="tldbg" width="100%">
	<tbody>
	<tr>
	<td class="tbldbg" style="width: 14.0cm;">
		<div id="prefadoros" class="prefadoros">
			Τραπέζι
		</div>
	</td>
	<td class="tbldbg" style="width: 1.0cm; vertical-align: top;">
		CP
	</td>
	<td class="tbldbg" style="vertical-align: top;">
		<div class="PSSHeaderArea">
			Προσκλήσεις
			<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
				class="PSSSizingIcon" title="Μείωση περιοχής προσκλήσεων"
				onclick="PSS.prosklisi.afxisi();" >
			<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
				class="PSSSizingIcon" title="Αύξηση περιοχής προσκλήσεων"
				onclick="PSS.prosklisi.miosi();">
		</div>
		<div class="PSSArea prosklisiArea">
			Προσκλήσεις
		</div>
		<div class="PSSHeaderArea">
			Σχέσεις
		</div>
		<div class="PSSArea sxesiArea">
			Σχέσεις
		</div>
		<div class="PSSHeaderArea">
			Συζήτηση
		</div>
		<div class="PSSArea sizitisiArea">
			Συζήτηση
		</div>
	</td>
	<td class="tbldbg" style="width: 1.0cm; vertical-align: top;">
	xxx
	</td>
	</tr>
	</tbody>
	</table>
	<?php
}

function welcome() {
	?>
	<p class="welcome">
		Καλώς ήλθατε στο διαδικτυακό καφενείο της πρέφας.
		Ο ιστότοπος σας δίνει τη δυνατότητα να παίξετε την αγαπημένη σας
		πρέφα με τους φίλους σας οποιαδήποτε ώρα και χωρίς να βρίσκεστε
		απαραίτητα στον ίδιο χώρο. Η πρέφα παίζεται με τους παραδοσιακούς κανόνες
		που ισχύουν στην Ελλάδα και χωρίς τη δυνατότητα εναλλαγής
		τέταρτου παίκτη (τεμπέλη).
	</p>

	<p class="welcome">
		Για να παίξετε πρέφα στο διαδικτυακό καφενείο, αρκεί να
		<a href="<?php print $globals->server; ?>account/signup.php">δημιουργήσετε λογαριασμό</a>,
		να στήσετε ένα τραπέζι
		και να προσκαλέσετε τους φίλους σας στο παιχνίδι. Μπορείτε,
		ακόμη να δεχθείτε προσκλήσεις των φίλων σας σε δικά τους
		τραπέζια. Έχετε τη δυνατότητα να δημιουργήσετε φίλους,
		να αποκλείσετε ενοχλητικά πρόσωπα και να συζητήσετε με
		τους συμπαίκτες σας για το παιχνίδι.
	</p>
	<?php
}
?>
