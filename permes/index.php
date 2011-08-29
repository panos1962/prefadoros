<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Page::head();
Page::stylesheet('permes/permes');
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('permes/permes');
Page::javascript('prefadoros/sxesi');
Page::javascript('prefadoros/prefadoros');
Page::javascript('lib/soundmanager');
Page::body();
Prefadoros::pektis_check();
Page::epikefalida(Globals::perastike('pedi'));
Page::fyi();
?>
<div class="mainArea permesArea">
<?php
if (Globals::perastike('pros')) {
	minima_pros($_REQUEST['pros'], TRUE);
}
else {
	minimata();
}
?>
</div>
<?php
Page::close();

// Η function "minima_pros" σχηματίζει τη φόρμα αποστολής μηνυμάτων.
// Ως παραμέτρους δέχεται το login name του παραλήπτη ("pros") και
// τη flag "pros_fixed" που δείχνει αν ο παραλήπτης είναι συγκεκριμένος
// και δεν μπορεί να καθοριστεί στην παραγόμενη φόρμα.

function minima_pros($pros = '', $pros_fixed = FALSE) {
	global $globals;
	?>
	<div class="formaData" style="padding: 0.4cm;">
	<div style="padding-bottom: 0.2cm;">
		<span style="font-style: italic; margin-left: 0.2cm;">
			Αποστολή προσωπικού μηνύματος προς</span><?php
		if ($pros_fixed) {
			?>
			<span class="permesPros"><?php print $pros; ?></span>
			<input id="paraliptis" type="hidden" value="<?php
				print $pros; ?>" /><?php
		}
		else {
			?>
			<input id="paraliptis" type="text" value="<?php
				print $pros; ?>" maxlength="32" size="20"
				class="formaField" /><?php
		}?>
	</div>
	<div style="width: 20.0cm;">
	<textarea id="permesInput" rows="14" cols="<?php print $pros_fixed ? 80 : 80; ?>"
		style="font-size: 0.4cm;"><?php
		if (Globals::perastike('minima')) {
			print $_REQUEST['minima'];
		} ?></textarea>
	<div id="formaFyi" class="fyi formaFyi">&#xfeff;</div>
	<input class="button formaButton" type="submit" value="Αποστολή"
		onclick="return Permes.apostoli(<?php print $pros_fixed ? 'true' : 'false';
			?>, getelid('emailIcon'));" />
	<img id="emailIcon" src="<?php print $globals->server; ?>images/email.png"
		style="width: 0.7cm; margin-bottom: -0.18cm; margin-left: -0.4cm;" alt="" />
	<input class="button formaButton" type="submit" value="Πρόσκληση"
		onclick="return Permes.prosklisi(getelid('emailIcon'));" />
	<input class="button formaButton" type="reset" value="Reset"
		onclick="return Permes.reset();" />
	<input class="button formaButton" type="submit" value="Άκυρο"
		onclick="return Permes.cancel(<?php if ($pros_fixed) print 'true'; ?>);" />
	</div>
	</div>
	<?php
}

function minimata() {
	?>
	<div id="formaApostolis" style="display: none; margin-bottom: 1.0cm;">
		<?php minima_pros(); ?>
	</div>
	<div style="margin-top: 0px;">
	Εισερχόμενα <input id="iser" type="checkbox" checked="yes" onchange="Permes.refresh('iser');" />
	Εξερχόμενα <input id="exer" type="checkbox" onchange="Permes.refresh('exer');" />
	<input class="button formaButton" type="submit" value="Ανανέωση"
		onclick="location.href=location.href;return false;" style="margin-left: 1.0cm;" />
	<input class="button formaButton" type="submit" value="Σύνθεση"
		onclick="return Permes.sinthesi();" style="margin-left: 0.5cm;" />
	<input class="button formaButton" type="submit" value="Άκυρο"
		onclick="self.close(); return false;" style="margin-left: 0.5cm;" />
	</div>
	<div id="minimata" style="margin-top: 0px;">
	</div>
	<?php
}
?>
