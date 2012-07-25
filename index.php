<?php
require_once 'lib/standard.php';
require_once 'pektis/pektis.php';
require_once 'trapezi/trapezi.php';
require_once 'lib/trapoula.php';
require_once 'prefadoros/prefadoros.php';
require_once 'account/photo.php';
set_globals();
$globals->klista = KLISTA_SELIDA;
if (file_exists($globals->klista)) {
	unset($globals->pektis);
}
else {
	unset($globals->klista);
	Prefadoros::set_pektis();
}

Page::head();
if ($globals->is_pektis()) {
	Page::stylesheet('prefadoros/prefadoros');
	if (file_exists("PRODUCTION")) {
		Page::javascript('PRODUCTION/compressed');
	}
	else {
		Page::javascript('prefadoros/dedomena');
		Page::javascript('prefadoros/misc');
		Page::javascript('prefadoros/prefadoros');
		Page::javascript('prefadoros/partida');
		Page::javascript('prefadoros/dianomi');
		Page::javascript('prefadoros/kinisi');
		Page::javascript('prefadoros/prosklisi');
		Page::javascript('prefadoros/sxesi');
		Page::javascript('prefadoros/permes');
		Page::javascript('prefadoros/trapezi');
		Page::javascript('prefadoros/sizitisi');
		Page::javascript('prefadoros/pexnidi');
		Page::javascript('prefadoros/gipedo');
		Page::javascript('prefadoros/pliromi');
		Page::javascript('lib/controlPanel');
		Page::javascript('lib/pss');
		Page::javascript('lib/emoticons');
		Page::javascript('lib/soundmanager');
	}
	Prefadoros::set_trapezi();
	Prefadoros::set_params();
}
Page::body();
Google_AdSense();
if ($globals->is_pektis()) {
	if (!Globals::perastike('motd')) {
		Page::motd();
	}
}
if ($globals->is_pektis()) {
	if (!Globals::perastike('diafimisi')) {
		Page::diafimisi();
	}
}
Google_AdSearch();
Page::toolbar();
?>
<div id="motto" class="motto" title="Κλικ για απόκρυψη"></div>
<div id="giortes" style="display: none;"></div>
<div id="profinfo" class="profinfo"></div>
<div class="mainArea">
<div style="position: relative;">
<div id="dialogosExo" class="dialogos"></div>
</div>
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
$globals->klise_fige();

function prefadoros() {
	global $globals;

	$ip = "";
	if (isset($_SERVER) && is_array($_SERVER)) {
		if (array_key_exists("REMOTE_ADDR", $_SERVER)) {
			$ip = $_SERVER["REMOTE_ADDR"];
		}
		if (array_key_exists("HTTP_X_FORWARDED_FOR", $_SERVER)) {
			$ip2 = $_SERVER["HTTP_X_FORWARDED_FOR"];
			$ip2 = explode(",", $ip2);
			if (count($ip2) > 0) {
				/*
				file_put_contents("ip.txt",
					$globals->pektis->login . ", ip = @" . $ip . "@, " .
					"ip2 = @" . $ip2[0] . "@\n",
					FILE_APPEND | LOCK_EX);
				*/
				$ip = $ip2[0];
			}
		}
	}

	Prefadoros::klise_sinedria();
	check_pektis_photo($globals->pektis->login, "");
	$query = "INSERT INTO `sinedria` (`pektis`, `ip`) VALUES (" .
		$globals->pektis->slogin . ", '" . $ip . "')";
	$globals->sql_query($query);

	$trapoula = new Trapoula;
	?>
	<script type="text/javascript">
	//<![CDATA[
	sinedria.kodikos = <?php print mysqli_insert_id($globals->db); ?>;
	sinedria.id = 0;
	sinedria.load = null;
	sinedria.dumprsp = <?php print Globals::perastike('dumprsp') ? 'true' : 'false'; ?>;
	globals.funchatServer = '<?php print FUNCHAT_SERVER; ?>';
	globals.systemAccount = '<?php print SYSTEM_ACCOUNT; ?>';
	globals.mobile = <?php print Globals::session_set('ps_mobile') ? "true" : "false"; ?>;
	pektis.superuser = <?php print $globals->pektis->superuser ? 'true' : 'false'; ?>;
	pektis.system = <?php print $globals->pektis->login == SYSTEM_ACCOUNT ? 'true' : 'false'; ?>;
	pektis.enalagi = <?php print $globals->pektis->enalagi ? 'true' : 'false'; ?>;
	//]]>
	</script>
	<?php emfanisi_theatis(); ?>
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
			<div id="activeRadio" class="activeRadio"></div>
			<?php
			prosklisi_area();
			sxesi_area();
			sizitisi_area();
			?>
		</div>
	</td>
	<td id="emoticonsColumn" class="emoticonsColumn tbldbg">
		<?php emoticons(); ?>
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

function emfanisi_theatis() {
	global $globals;

	$query = "SELECT `trapezi` FROM `theatis` WHERE `pektis` = BINARY '" .
		$globals->pektis->login . "'";
	$result = @mysqli_query($globals->db, $query);
	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		Prefadoros::set_trapezi_dirty();
		return;
	}

	@mysql_free_result($result);
	Prefadoros::set_trapezi_dirty($row[0]);
}

function control_panel() {
	global $globals;
	?>
	<div style="position: absolute;">
		<img id="controlPanelIcon" class="controlPanelIcon" alt="" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			style="border-style: dotted;"
			onmouseover="controlPanel.mesaExo(this, true);"
			onmouseout="controlPanel.mesaExo(this, false);"
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
		<span id="prosklisiControls"></span>
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
		<input id="peknpat" class="pssInput" type="text" value="" maxlength="256"
			size="18" onkeyup="Sxesi.patchange(event, this);"
			style="background-image: url('<?php print $globals->server;
				?>images/sxesiPrompt.png');" />
		<img id="sxetikosIcon" src="<?php print $globals->server; ?>images/sxetikos.png"
			class="pssIcon" title="Σχετιζόμενοι" alt=""
			onclick="Sxesi.sxetizomenoi(this);" />
		<img id="pekstat" src="<?php print $globals->server; ?>images/blueBall.png"
			class="pssIcon" alt=""
			title="Βλέπετε σχετιζόμενους παίκτες. Κλικ για διαθέσιμους παίκτες"
			onclick="Sxesi.pekstat(this);" />
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
	<div class="pssHeaderArea" style="position: relative;">
		<div id="filoPaleta" class="filoPaleta" title="Παλέτα χρωμάτων και φύλλων"
			onmouseover="setOpacity(this, 100);" onmouseout="setOpacity(this, 30);"
			onmousedown="FiloPaleta.piase(event, this);"></div>
		<input id="sxolioInput" class="pssInput" type="text" value="" maxlength="4096" <?php
			if ($globals->is_pektis() && ($globals->pektis->login == SYSTEM_ACCOUNT)) {
				?>disabled="disabled" <?php
			}
			?> size="16" style="background-image: url('<?php
			print $globals->server; ?>images/sizitisiPrompt.png');"
			onkeyup="Sizitisi.keyCheck(event, this);" />
		<input id="sxolioInputHidden" type="hidden" value="" maxlength="4096" size="0" />
		<span id="sizitisiControls"></span>
		<div class="pssSizing">
		<img src="<?php print $globals->server; ?>images/miosiPerioxis.png"
			class="pssSizingIcon" title="Μείωση περιοχής συζήτησης"
			onclick="pss.sizitisi.miosi(this);" alt="" />
		<img src="<?php print $globals->server; ?>images/afxisiPerioxis.png"
			class="pssSizingIcon" title="Αύξηση περιοχής συζήτησης"
			onclick="pss.sizitisi.afxisi(this);" alt="" />
		</div>
	</div>
	<div id="sizitisiArea" class="pssArea sizitisiArea"
		title="Κλικ για σταθεροποίηση/ρολάρισμα του κειμένου"
		onclick="Sizitisi.scrollBottomOnOff();">
	<div id="sizitisiTrapezi" style="display: none;"></div>
	<div id="sizitisiKafenio" style="display: none;"></div>
	<div id="sxolioPreview"></div>
	</div>
	<?php
}

function emoticons() {
	global $globals;
	?>
	<div style="position: absolute;">
		<img class="controlPanelIcon" alt="" src="<?php
			print $globals->server; ?>images/controlPanel/4Balls.png"
			style="border-style: dotted;"
			onmouseover="controlPanel.mesaExo(this, true);"
			onmouseout="controlPanel.mesaExo(this, false);"
			title="Εναλλαγή emoticons" onclick="Emoticons.enalagi();" />
		<div id="emoticons">
		</div>
	</div>
	<?php
}

function welcome() {
	global $globals;

	if (isset($globals->klista)) {
		if (file_exists($globals->klista)) {
			$minima = file_get_contents($globals->klista);
		}
		if ($minima != "") {
			print $minima;
		}
		else {
			?>
			<p class="welcome" style="margin-top: 0.0cm; font: 150%; font-weight: bold;">
				Είμαστε κλειστά για λίγο, δοκιμάστε αργότερα…
			</p>
			<?php
		}
		return;
	}
	?>
	<p class="welcome" style="margin-top: 0.0cm;">
		Καλώς ήλθατε στον Πρεφαδόρο. Πρόκειται για ιστότοπο
		που επιχειρεί να προσομοιάσει ένα διαδικτυακό καφενείο της πρέφας.
		Ο ιστότοπος σας δίνει τη δυνατότητα να παίξετε την αγαπημένη σας
		πρέφα με τους φίλους σας οποιαδήποτε ώρα και χωρίς να βρίσκεστε
		απαραίτητα στον ίδιο χώρο. Η πρέφα παίζεται με τους παραδοσιακούς κανόνες
		που ισχύουν στην Ελλάδα, αλλά χωρίς τη δυνατότητα εναλλαγής
		τέταρτου παίκτη (τεμπέλη).
	</p>

	<p class="welcome">
		Για να παίξετε πρέφα στον Πρεφαδόρο, αρκεί να
		<a href="<?php print $globals->server; ?>account/signup.php">δημιουργήσετε λογαριασμό</a>,
		να στήσετε ένα τραπέζι
		και να προσκαλέσετε τους φίλους σας στο παιχνίδι, ή να
		αποδεχθείτε προσκλήσεις των φίλων σας για να παίξετε
		στα δικά τους τραπέζια. Έχετε τη δυνατότητα να δημιουργήσετε φίλους,
		να αποκλείσετε ενοχλητικά πρόσωπα και να συζητήσετε με
		τους συμπαίκτες σας για το παιχνίδι.
	</p>

	<p class="welcome" style="font-style: italic; text-decoration: underline;">
		Προσοχή
	</p>

	<p class="welcome">
		Φίλοι πρεφαδόροι,
		<span style="color: #FF0000;">αποφύγετε τον Internet Explorer</span>.
		Είναι καλός browser, αλλά για να δουλέψει σωστά και γρήγορα με το παιχνίδι
		απαιτεί πολλές ρυθμίσεις.
		Προτιμήστε τους <a href="http://www.google.com/chrome/?brand=CHLI&hl=el"
			title="Εγκαταστήστε τον Chrome της Google στον υπολογιστή σας"
			target="_blank" style="color: #006400;">Chrome</a>,
		<span style="color: #006400;">Firefox</span>,
		<span style="color: #006400;">Opera</span> και
		<span style="color: #006400;">Safari</span> με αυτή τη σειρά.
	</p>

	<p class="welcome">
		Αν δουλεύετε <span style="color: #FF0000;">Torrent, απενεργοποιήστε το</span>
		όσο είστε στον Πρεφαδόρο.
		Προκαλεί δυσλειτουργία καθώς διαγκωνίζεται με τον
		Πρεφαδόρο για τους δικτυακούς πόρους του υπολογιστή σας,
		με αποτέλεσμα να μην λειτουργούν σωστά, τόσο ο Πρεφαδόρος,
		όσο και το ίδιο το Torrent.
		Παρόμοια δυσλειτουργία μπορεί να προκληθεί
		από διαδικτυακή τηλεόραση, ή άλλα προγράμματα
		με μεγάλες δικτυακές απαιτήσεις.
		Καλή διασκέδαση και καλές σολαρίες!
	</p>
	<?php
}

function Google_AdSense() {
	global $globals;
	?>
	<div id="GoogleAdSense" style="width: 730px; margin-left: auto;
		margin-right: auto; margin-bottom: 0.2cm;">
	<script type="text/javascript"><!--
	google_ad_client = "ca-pub-2140287108424127";
	/* Πρεφαδόρος */
	google_ad_slot = "8921606943";
	google_ad_width = 728;
	google_ad_height = 90;
	//-->
	</script>
	<script type="text/javascript"
	src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
	</script>
	</div>
	<?php
	if ($globals->not_pektis()) {
		return;
	}

	// Ο κώδικας που ακολουθεί ελέγχει αν ο παίκτης έχει παίξει
	// κάποιες διανομές και αν ναι, τότε εκτυπώνει μήνυμα σχετικό
	// με τη χρήση του κλικ σε συνδυασμό με τα πλήκτρα Control
	// και Shift, καθώς η Google ανοίγει τις διαφημίσεις πάνω στην
	// τρέχουσα σελίδα.

	// Το έχω απενεργοποιήσει.
	return;

	$dianomes = 0;

	$fname = "stats/rank.txt";
	$fp = @fopen($fname, "r");
	if (!$fp) { return; }

	while ($buf = Globals::get_line($fp)) {
		$x = explode("\t", $buf);
		if (count($x) < 4) { continue; }
		if ($x[0] != $globals->pektis->login) { continue; }

		$dianomes = $x[2];
		break;
	}
	@fclose($fp);

	if ($dianomes < 10) {
		return;
	}
	?>
	<div style="width: 730px; margin-left: auto; margin-right: auto;
		text-align: right; margin-bottom: 0.2cm; font-style: italic;
		font-family: Trebucht-MS, sans-serif; font-size: 0.34cm;
		color: #CC3300; font-weight: normal;">
		Άνοιγμα διαφημιστικού σε νέα καρτέλα: Control+Click, σε νέο παράθυρο: Shift+Click
	</div>
	<?php
}

function Google_AdSearch() {
	global $globals;
	?>
	<div style="width: 11.0cm; float: right;">
	<form action="http://www.google.gr" id="cse-search-box" target="_blank">
		<div>
			<input type="hidden" name="cx"
				value="partner-pub-2140287108424127:8475141205" />
			<input type="hidden" name="ie" value="UTF-8" />
			<input type="text" name="q" size="30" />
			<input type="submit" name="sa" value="Αναζήτηση" />
		</div>
	</form>
	</div>
	<br />
	<script type="text/javascript" src="<?php
		print "http://www.google.gr/coop/cse/brand?form=cse-search-box&amp;lang=el";
		?>">
	</script>
	<?php
}
?>
