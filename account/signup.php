<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';
define('MAX_PHOTO_SIZE', 50000);
set_globals();
Prefadoros::set_pektis();
Page::head();
Page::stylesheet('lib/forma');
Page::stylesheet('account/signup');
Page::javascript('lib/forma');
Page::javascript('account/account');
Page::body();
Page::epikefalida($globals->is_pektis());
Page::fyi();
?>
<div class="mainArea">
<form class="forma" method="post" action="<?php print $globals->server;
	?>account/uploadPhoto.php" enctype="multipart/form-data"
	target="uploadFrame" style="position: relative; padding-top: 1em;">
<table class="formaData tbldbg">
<tr>
	<td class="formaHeader tbldbg" colspan="2">
		<?php print ($globals->is_pektis() ? 'Update' : 'Create'); ?> account
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Login
	</td>
	<td class="tbldbg">
		<input name="login" id="login" type="text" maxlength="32"
			size="32" class="formaField"
			<?php
			if ($globals->is_pektis()) {
				?>
				value="<?php print $globals->pektis->login; ?>"
				disabled="disabled" style="font-weight: bold;"
				<?php
			}
			else {
				?>
				value="" onkeyup="account.checkLoginOnline(this);"
				onchange="account.loginAvailable(this);"
				<?php
			}
			?> />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Ονοματεπώνυμο
	</td>
	<td class="tbldbg">
		<input id="onoma" name="onoma" type="text" maxlength="128" size="50" value="<?php
			if ($globals->is_pektis()) {
				print $globals->pektis->onoma;
			}
			?>" class="formaField" onfocus="formaFyi();" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Email
	</td>
	<td class="tbldbg">
		<input name="email" type="text" maxlength="64" size="50" value="<?php
			if ($globals->is_pektis()) {
				print $globals->pektis->email;
			}
			?>" onkeydown="this.style.color=globals.color.ok;"
			onfocus="formaFyi();" onblur="account.checkEmailValue(this);"
			class="formaField" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Πλάτη&nbsp;παιγνιοχάρτων
	</td>
	<td class="tbldbg">
		<select name="plati" class="formaField formaSelect"
			onfocus="formaFyi('Χρώμα πλάτης παιγνιοχάρτων');">
			<?php plati_list(); ?>
		</select>
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Εναλλαγή&nbsp;χρωμάτων
	</td>
	<td class="tbldbg">
		<select name="enalagi" class="formaField formaSelect"
			onfocus="formaFyi('Τακτοποίηση φύλλων κατά χρώμα');">
			<?php enalagi_list(); ?>
		</select>
	</td>
</tr>
<?php
if ($globals->is_pektis()) {
	?>
	<tr>
		<td class="formaPrompt tbldbg">
			Τρέχων&nbsp;κωδικός
		</td>
		<td class="tbldbg">
			<input name="password" type="password" maxlength="50"
				size="16" value="@@@@@@" class="formaField"
				onfocus="formaFyi();" />
			<div style="position: relative; display: inline-block;">
				<?php photo_area(); ?>
			</div>
		</td>
	</tr>
	<?php
}

// Τα δύο πεδία που ακολουθούν αφορούν στην εισαγωγή νέου κωδικού είτε
// κατά την εγγραφή νέου παίκτη, είτε στη φάση αλλαγής του κωδικού.
// Πρόκειται για το πεδίο του νέου κωδικού και για παρόμοιο πεδίο στο
// οποίο ο παίκτης επαναλαμβάνει τον κωδικό του για να μη γίνει κάποιο
// λάθος (κλασική διαδικασία θέσης/αλλαγής password).
// Ίσως παρατηρήσετε ότι υπάρχει διαφορετική αντιμετώπιση στα δύο πεδία,
// αλλά αυτό σχετίζεται μόνο με το ότι θέλουμε να καταλαμβάνεται μια
// γραμμή ακόμη όταν το ψευδοlink εμφάνισης των εν λόγω πεδίων είναι
// εμφανές.
?>
<tr id="neosKodikos" <?php if ($globals->is_pektis()) {?> style="visibility: hidden;" <?php }?>>
	<td class="formaPrompt tbldbg">
		<?php print $globals->is_pektis() ? "Νέος κωδικός" : "Κωδικός" ?>
	</td>
	<td class="tbldbg">
		<input name="password1" type="password" maxlength="50" size="16"
			value="" class="formaField" onfocus="formaFyi();" />
	</td>
</tr>
<tr id="neosKodikos2" <?php if ($globals->is_pektis()) {?> style="visibility: hidden;" <?php }?>>
	<td class="formaPrompt tbldbg">
		Επαναλάβατε
	</td>
	<td class="tbldbg">
		<input name="password2" type="password" maxlength="50" size="16"
			value="" class="formaField" onfocus="formaFyi();" />
	</td>
</tr>
<tr>
	<td colspan="2">
		&#xfeff;<span id="formaFyi" class="fyi formaFyi"></span>
	</td>
</tr>
<?php
if ($globals->is_pektis()) {
	?>
	<tr>
	<td colspan="2">
	<div  style="padding: 0.2cm; font-style: italic; color: #003366;">
	Για να καταχωρήσετε οποιαδήποτε αλλαγή θα πρέπει να πληκτρολογήσετε
	τον τρέχοντα κωδικό σας (password) στο φερώνυμο πεδίο της φόρμας, πριν κάνετε
	κλικ στο πλήκτρο [Update&nbsp;account].
	</div>
	</td>
	</tr>
	<?php
}
?>
</table>
<table class="formaPanel tbldbg">
<tr style="vertical-align: top;">
	<td class="tbldbg">
		<input type="submit" value="<?php
			print ($globals->is_pektis() ? 'Update' : 'Create') ; ?> account"
			class="button formaButton"
			onclick="return account.<?php print ($globals->is_pektis() ?
				'update' : 'add' ); ?>Pektis(this.form);" />
	</td>
	<td class="tbldbg">
		<input type="reset" value="Reset" class="button formaButton"
			onfocus="formaFyi('Επαναφορά αρχικών δεδομένων φόρμας');" />
	</td>
	<td class="tbldbg">
		<input type="button" value="Cancel" class="button formaButton"
			onfocus="formaFyi('Έξοδος από τη φόρμα');" onclick="return exitChild();" />
	</td>
	<?php photo_input() ?>
</tr>
</table>
</form>
</div>
<?php
Page::close();

function plati_list() {
	global $globals;

	$timi = array("RANDOM", "BLUE", "RED");
	$desc = array();
	$desc["RANDOM"] = "Τυχαία";
	$desc["BLUE"] = "Μπλε";
	$desc["RED"] = "Κόκκινη";

	if ($globals->is_pektis()) {
		$plati = $globals->pektis->plati;
		?>
		<option value="<?php print $plati; ?>" selected="selected"><?php
			print $desc[$plati]; ?></option>
		<?php
	}
	else {
		$plati = "";
	}

	for ($i = 0; $i < 3; $i++) {
		if ($timi[$i] != $plati) {
			?>
			<option value="<?php print $timi[$i]; ?>"><?php
				print $desc[$timi[$i]]; ?></option>
			<?php
		}
	}
}

function enalagi_list() {
	global $globals;

	$timi = array("NO", "YES");
	$desc = array();
	$desc["NO"] = "ΠΑΝΤΑ ΜΠΑΣΤΟΥΝΙΑ, ΚΑΡΑ, ΣΠΑΘΙΑ, ΚΟΥΠΕΣ";
	$desc["YES"] = "ΕΝΑΛΛΑΓΗ ΧΡΩΜΑΤΩΝ (ΜΑΥΡΑ/ΚΟΚΚΙΝΑ)";

	if ($globals->is_pektis()) {
		$enalagi = ($globals->pektis->enalagi ? 'YES' : 'NO');
		?>
		<option value="<?php print $enalagi; ?>" selected="selected"><?php
			print $desc[$enalagi]; ?></option>
		<?php
	}
	else {
		$enalagi = "";
	}

	for ($i = 0; $i < 2; $i++) {
		if ($timi[$i] != $enalagi) {
			?>
			<option value="<?php print $timi[$i]; ?>"><?php
				print $desc[$timi[$i]]; ?></option>
			<?php
		}
	}
}

function photo_area() {
	global $globals;

	if (!$globals->is_pektis()) {
		return;
	}

	?>
	<div class="signupPhotoArea" title="Κλικ για αλλαγή εικόνας προφίλ"
		onclick="return account.selectPhoto();"
		onmouseover="diafaniaSet(getelid('photo')); formaFyi('<?php
			print "Αρχείο εικόνας τύπου JPEG/JPG, μικρότερο από " . MAX_PHOTO_SIZE . " bytes";
		?>');" onmouseout="diafaniaSet(getelid('photo'), 50); formaFyi();">
		<img id="photo" class="signupPhoto" src="<?php print $globals->server;
			?>photo/<?php print strtolower(substr($globals->pektis->login, 0, 1));
			?>/<?php print $globals->pektis->login; ?>.jpg" onerror="this.src='<?php
			print $globals->server; ?>/images/missingPhoto.png';" alt="" />
	</div>
	<div class="signupPhotoToolArea">
		<img class="signupPhotoTool" src="<?php print $globals->server;
			?>images/Xred.png" title="Διαγραφή εικόνας" alt=""
			onclick="account.deletePhoto();" style="margin-top: 0px;" />
		<img class="signupPhotoTool" src="<?php print $globals->server;
			?>images/undo.png" title="Επαναφορά εικόνας" alt=""
			onclick="account.restorePhoto();" />
	</div>
	<?php
}

function photo_input() {
	global $globals;

	/*
	if ($globals->server != "http://127.0.0.1/prefadoros/") {
		return;
	}
	*/

	if ($globals->not_pektis()) {
		return;
	}

	?>
	<td class="tbldbg">
		<iframe id="uploadFrame" name="uploadFrame" src=""
			style="display: none; width: 6.0cm; height: 3.0cm; background-color: #FFFF99;">
		</iframe>
		<input type="hidden" name="MAX_PHOTO_SIZE" value="<?php
			if ($globals->pektis->login == 'www.prefadoros.gr') {
				print 1000000;
			}
			else {
				print MAX_PHOTO_SIZE;
			}
		?>" />
		<input id="photoEnergia" type="hidden" name="photoEnergia" value="" />
		<input name="photoFile" id="uploadPhotoButton" type="file" size="10"
			accept="<?php print ($globals->pektis->login == SYSTEM_ACCOUNT ?
				"application/zip" : "image/jpeg"); ?>" style="visibility: hidden;" />
	</td>
	<?php
}

?>
