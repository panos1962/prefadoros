<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('account/account');
?>
<script type="text/javascript">
//<![CDATA[
function neosKodikosSwitch() {
	var x = getelid('neosKodikos');
	if (notSet(x)) { return; }
	x.style.display = x.style.display == 'none' ? 'inline-block' : 'none';
}

function mailme() {
	var sub = 'Πρεφαδόρος -- Αίτηση νέου κωδικού';
	var bod = 'Παρακαλώ να μου αποστείλετε νέο κωδικό στο email που έχω δηλώσει ' +
		'στον «Πρεφαδόρο».\r\n\r\nLogin: ';
	var x = getelid('login');
	if (isSet(x) && isSet(x.value)) { bod += x.value.trim(); }
	bod += '\r\n\r\nEmail: \r\n\r\nΤηλέφωνο: \r\n';
	var lnk = 'mailto:support' + '@' + 'prefadoros.net?subject=' + uri(sub) +
		'&body=' + uri(bod);
	var win = window.open(lnk, 'emailWindow');
	return false;
}
//]]>
</script>
<?php
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
		<div style="position: relative; display: inline-block;">&nbsp;
		<img src="<?php print $globals->server; ?>images/misc/sosivio.png" alt=""
			style="position: absolute; width: 1.0cm; top: 0px; left: 1.0cm; cursor: pointer"
			title="Ξεχάσατε τον κωδικό σας;" onclick="neosKodikosSwitch();" />
		</div>
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
			print $globals->server; ?>account/signup.php<?php
			if ($globals->perastike("main")) {
				print "?main=" . urlencode($_REQUEST["main"]);
			}?>">Εγγραφή</a>
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
		"στον «Πρεφαδόρο».\r\n\r\n" .
		"Login: \r\n\r\n" .
		"Email: \r\n\r\n" .
		"Τηλέφωνο: \r\n";
	?>
	<div id="neosKodikos" class="simantiko"
		style="position: absolute; top: 7.2cm; left: 6.2cm; width: 14.0cm; display: none;">
	<div style="text-align: center; margin-bottom: 0.2cm;">
	<div class="simantikoHeader">Επαναφορά κωδικού</div>
	</div>
	Αν έχετε ξεχάσει το login ή τον κωδικό σας, στείλτε μου σχετικό
	<a target="_blank" href="#" onclick="return mailme();">email</a>
	και θα σας στείλω νέο κωδικό στο email που έχετε δηλώσει στον «Πρεφαδόρο».
	Αν δεν είχατε δηλώσει σωστό email, τότε γράψτε μου έναν αρ. τηλεφώνου,
	ή κάποιο άλλο email για να επικοινωνήσω μαζί σας προσωπικά, αλλιώς θα
	πρέπει να δημιουργήσετε νέο λογαριασμό.
	</div>
	<?php
}
?>
