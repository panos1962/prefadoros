<?php
require_once 'lib/standard.php';
require_once 'pektis/pektis.php';
require_once 'trapezi/trapezi.php';
require_once 'lib/trapoula.php';
require_once 'prefadoros/prefadoros.php';
set_globals();
Prefadoros::set_pektis();
Page::head();
if ($globals->is_pektis()) {
	Page::stylesheet('prefadoros/prefadoros');
	Page::javascript('prefadoros/prefadoros');
	Page::javascript('prefadoros/sxesi');
	Page::javascript('prefadoros/permes');
	Page::javascript('prefadoros/kafenio');
	Page::javascript('lib/controlPanel');
	Page::javascript('lib/pss');
	Page::javascript('lib/emoticons');
	Page::javascript('lib/soundmanager');
	Prefadoros::set_trapezi();
	Prefadoros::set_params();
}
Page::body();
Page::motd();
if ($globals->is_pektis()) {
	Prefadoros::pektis_check();
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
	$query = "INSERT INTO `συνεδρία` (`παίκτης`) VALUES ('" .
		$globals->pektis->login . "')";
	$globals->sql_query($query);
	?>
	<script type="text/javascript">
	//<![CDATA[
	sinedria.kodikos = <?php print mysqli_insert_id($globals->db); ?>;
	sinedria.id = 0;
	//]]>
	</script>
	<table class="tldbg" width="100%">
	<tbody>
	<tr>
	<td class="prefadorosColumn tbldbg">
		<div id="prefadoros" class="prefadoros">
			<div class="partida">
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
		<div id="pss" class="pss">
			<?php
			prosklisi_area();
			sxesi_area();
			sizitisi_area();
			?>
		</div>
	</td>
	<td id="emoticonsColumn" class="emoticonsColumn tbldbg">
		<?php
		emoticons();
		?>
	</td>
	<td>
	</td>
	</tr>
	</tbody>
	</table>
	<div id="permesArea" class="permesArea" title="Χώρος εμφάνισης μηνυμάτων"
		onclick="Permes.stripShow(this, false);"></div>
	<?php
}

function control_panel() {
	global $globals;
	?>
	<div>
		<img class="controlPanelIcon" alt="" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			title="Εναλλαγή εργαλείων" onclick="controlPanel.enalagi();" />
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
		<div class="pssSizing">
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής προσκλήσεων"
			onclick="pss.prosklisi.miosi(this);" alt="" />
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής προσκλήσεων"
			onclick="pss.prosklisi.afxisi(this);" alt="" />
		</div>
	</div>
	<div id="prosklisiArea" class="pssArea prosklisiArea">
	</div>
	<?php
}

function sxesi_area() {
	global $globals;
	?>
	<div class="pssHeaderArea">
		<input id="spat" class="pssInput" type="text" value="" maxlength="256"
			size="20" onkeyup="Sxesi.patchange(event, this);"
			style="background-image: url('<?php print $globals->server;
				?>images/sxesiPrompt.png');" />
		<img id="sxetikosIcon" src="<?php print $globals->server; ?>images/sxetikos.png"
			class="pssIcon" title="Σχετιζόμενοι" alt="" />
		<img src="<?php print $globals->server; ?>images/greenBall.png"
			class="pssIcon" title="Online παίκτες" alt="" />
		<div class="pssSizing">
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής σχέσεων"
			onclick="pss.sxesi.miosi(this);" alt="" />
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής σχέσεων"
			onclick="pss.sxesi.afxisi(this);" alt="" />
		</div>
	</div>
	<div id="sxesiArea" class="pssArea sxesiArea">
	</div>
	<?php
}

function sizitisi_area() {
	global $globals;
	?>
	<div class="pssHeaderArea">
		<input id="mesg" class="pssInput" type="text" value="" maxlength="4096"
			size="30" style="background-image: url('<?php
			print $globals->server; ?>images/sizitisiPrompt.png');" />
		<div class="pssSizing">
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής συζήτησης"
			onclick="pss.sizitisi.miosi(this);" alt="" />
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής συζήτησης"
			onclick="pss.sizitisi.afxisi(this);" alt="" />
		</div>
	</div>
	<div id="sizitisiArea" class="pssArea sizitisiArea">
	</div>
	<?php
}

function emoticons() {
	global $globals;
	?>
	<div>
		<img class="emoticonsIcon" alt="" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			title="Εναλλαγή emoticons" onclick="emoticons.enalagi();" />
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
