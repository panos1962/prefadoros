<?php
require_once 'lib/standard.php';
require_once 'lib/trapoula.php';
set_globals();
Page::head();
if ($globals->is_pektis()) {
	Page::stylesheet('lib/prefadoros');
	Page::javascript('lib/prefadoros');
	Page::javascript('lib/controlPanel');
	Page::javascript('lib/pss');
	Page::javascript('lib/emoticons');
	Page::javascript('lib/soundmanager');
}
Page::body();
Page::motd();
if ($globals->is_pektis()) {
	Page::diafimisi();
}
Page::toolbar();
?>
<div class="mainArea">
<?php
Page::fyi();
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
	$trapoula = new Trapoula;

	?>
	<table class="tldbg" width="100%">
	<tbody>
	<tr>
	<td id="prefadorosColumn" class="prefadorosColumn tbldbg">
		<div id="prefadoros" class="prefadoros">
			<div class="trapezi">
				<?php $trapoula->parousiasi(); ?>
			</div>
		</div>
	</td>
	<td class="controlPanelColumn tbldbg">
		<?php
		control_panel();
		?>
	</td>
	<td class="pssColumn tbldbg">
		<?php
		prosklisi_area();
		sxesi_area();
		sizitisi_area();
		?>
	</td>
	<td id="emoticonsColumn" class="emoticonsColumn tbldbg">
		<?php
		emoticons();
		?>
	</td>
	</tr>
	</tbody>
	</table>
	<div class="infoArea" title="Χώρος εμφάνισης μηνυμάτων"
		onclick="infoStripShow(this);"></div>
	<?php
}

function control_panel() {
	global $globals;
	?>
	<div>
		<img class="controlPanelIcon" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			alt="" title="Εναλλαγή εργαλείων" onclick="controlPanel.enalagi();" />
		<div id="controlPanel">
		</div>
	</div>
	<?php
}

function prosklisi_area() {
	global $globals;
	?>
	<div class="pssHeaderArea">
		<span class="data">Προσκλήσεις</span>
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής προσκλήσεων"
			onclick="pss.prosklisi.afxisi(this);" >
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής προσκλήσεων"
			onclick="pss.prosklisi.miosi(this);">
	</div>
	<div id="prosklisiArea" class="pssArea prosklisiArea">
		Προσκλήσεις
	</div>
	<?php
}

function sxesi_area() {
	global $globals;
	?>
	<div class="pssHeaderArea">
		<span class="data">Σχέσεις</span>
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής σχέσεων"
			onclick="pss.sxesi.afxisi(this);" >
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής σχέσεων"
			onclick="pss.sxesi.miosi(this);">
	</div>
	<div id="sxesiArea" class="pssArea sxesiArea">
		Σχέσεις
	</div>
	<?php
}

function sizitisi_area() {
	global $globals;
	?>
	<div class="pssHeaderArea">
		<span class="data">Συζήτηση</span>
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής συζήτησης"
			onclick="pss.sizitisi.afxisi(this);" >
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής συζήτησης"
			onclick="pss.sizitisi.miosi(this);">
	</div>
	<div id="sizitisiArea" class="pssArea sizitisiArea">
		Συζήτηση
	</div>
	<?php
}

function emoticons() {
	global $globals;
	?>
	<div>
		<img class="emoticonsIcon" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			alt="" title="Εναλλαγή emoticons" onclick="emoticons.enalagi();" />
		<div id="emoticons">
		</div>
	</div>
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
