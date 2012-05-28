<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('account/account');
Page::body();
Page::epikefalida(FALSE);
Page::fyi();
aftonomo_check();
?>
<div class="mainArea">
<form class="forma" method="post" action="<?php
	// Αν έχει περαστεί URL παράμετρος "main", τότε πρόκειται για τη
	// διεύθυνση σελίδας στην οποία θα μεταβεί ο παίκτης αμέσως μετά
	// την (επιτυχημένη) είσοδό του στον «Πρεφαδόρο».
	print $globals->perastike("main") ?  $_REQUEST["main"] : ($globals->server . "index.php");
	?>" style="padding-top: 1em;">
<table class="formaData tbldbg">
<tr>
	<td class="formaHeader tbldbg" colspan="2">
		Φόρμα εισόδου
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Login
	</td>
	<td class="tbldbg">
		<input name="login" id="login" type="text" maxlength="32" size="32"
			value="" class="formaField" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Κωδικός
	</td>
	<td class="tbldbg">
		<input name="password" type="password" maxlength="50" size="16"
			value="" class="formaField" />
	</td>
</tr>
<tr>
	<td colspan="2">
		&#xfeff;<span id="formaFyi" class="fyi formaFyi"></span>
	</td>
</tr>
</table>
<table class="formaPanel tbldbg">
<tr>
	<td class="tbldbg">
		<input type="submit" value="Login" class="button formaButton"
			onclick="return account.loginCheck(this.form);" />
	</td>
	<td class="tbldbg">
		<input type="reset" value="Reset" class="button formaButton" />
	</td>
	<td class="tbldbg">
		<input type="button" value="Cancel" class="button formaButton" onclick="<?php
			if ($globals->perastike('aftonomo')) {
				?>window.self.close(); return false;<?php
			}
			else {
				?>return exitChild();<?php
			}
			?>" />
	</td>
	<td class="tbldbg">
		<a title="Εγγραφείτε στον «Πρεφαδόρο»" style="margin-left: 0.8cm;" href="<?php
			print $globals->server; ?>/account/signup.php">Εγγραφή</a>
	</td>
</tr>
</table>
</form>
</div>
<?php
neos_kodikos();
Page::close();

function aftonomo_check() {
	global $globals;
	if (!$globals->perastike('aftonomo')) {
		return;
	}
	?>
	<div id="simiomaEgrafis" class="simantiko" style="top: 1.8cm; width: 16.0cm;"
		onmouseover="getelid('apokripsisimiomaEgrafis').style.visibility='visible';"
		onmouseout="getelid('apokripsisimiomaEgrafis').style.visibility='hidden';">
	<?php Page::apokripsi('simiomaEgrafis'); ?>
	<div style="text-align: center; margin-bottom: 0.2cm;">
	<div class="simantikoHeader">ΣΗΜΑΝΤΙΚΟ</div>
	</div>
	Η σελίδα που ζητήσατε προϋποθέτει την είσοδό σας στον «<a href="<?php
	print $globals->server . "index.php"; ?>">Πρεφαδόρο</a>». Εφόσον είστε
	ήδη εγγεγραμμένοι στον «Πρεφαδόρο», εισέλθετε δίνοντας το όνομά σας και
	τον κωδικό σας, αλλιώς θα πρέπει να <a href="<?php print $globals->server;
	?>account/signup.php?aftonomo=yes<?php
		if ($globals->perastike("main")) {
			print "&main=" . urlencode($_REQUEST["main"]);
		}
		?>">εγγραφείτε</a>
	στον «Πρεφαδόρο» προκειμένου να προβληθεί το περιεχόμενο αυτής της σελίδας.
	</div>
	<script type="text/javascript">
	//<![CDATA[
	setTimeout(function() {
		var x = getelid('simiomaEgrafis');
		if (notSet(x)) { return; }
		if (isSet(x.pineza) && x.pineza) {return; }
		sviseNode(x, 500);
	}, 50000);
	//]]>
	</script>
	<?php
}

function neos_kodikos() {
	$subject = "Πρεφαδόρος -- Αίτηση νέου κωδικού";
	$body = "Παρακαλώ να μου αποστείλετε νέο κωδικό στο email που έχω δηλώσει " .
		"στον «Πρεφαδόρο».\r\n\r\nΤο login μου είναι: \r\n\r\n" .
		"Αν δεν θυμάστε το login σας, γράψτε το email που είχατε " .
		"δηλώσει κατά την εγγραφή σας: \r\n";
	?>
	<div id="neos_kodikos" class="simantiko"
		style="top: 10.2cm; width: 14.0cm; visibility: visible;">
	Αν έχετε ξεχάσει το login ή τον κωδικό σας, στείλτε μου σχετικό
	<a target="_blank" href="mailto:panos@prefadoros.net?subject=<?php
		print urlencode($subject); ?>&body=<?php
		print urlencode($body); ?>">email</a>
	και θα σας στείλω νέο κωδικό στο email που έχετε δηλώσει στον «Πρεφαδόρο».
	Αν δεν είχατε δηλώσει σωστό email, τότε, δυστυχώς, θα πρέπει να 
	δημιουργήσετε νέο λογαριασμό.
	</div>
	<?php
}
?>
