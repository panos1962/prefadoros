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
Page::javascript('lib/soundmanager');
Page::body();
Page::epikefalida(Globals::perastike('pedi'));
Page::fyi();
Prefadoros::pektis_check();
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
	?>
	<div style="padding-top: 0.4cm; padding-bottom: 0.4cm;">
	<span class="data">Αποστολή προσωπικού μηνύματος προς <?php
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
		}?></span>
	</div>
	<div style="width: 11.0cm;">
	<textarea id="permesInput" rows="14" cols="<?php print $pros_fixed ? 60 : 80; ?>">
	</textarea>
	<div id="formaFyi" class="fyi formaFyi">&#xfeff;</div>
	<input class="button formaButton" type="submit" value="Αποστολή"
		onclick="return Permes.apostoli(<?php if ($pros_fixed) print 'true'; ?>);" />
	<input class="button formaButton" type="reset" value="Reset"
		onclick="return Permes.reset();" />
	<input class="button formaButton" type="submit" value="Άκυρο"
		onclick="return Permes.cancel(<?php if ($pros_fixed) print 'true'; ?>);" />
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
	<input class="button formaButton" type="submit" value="Σύνθεση"
		onclick="return Permes.sinthesi();" style="margin-left: 4.0cm;" />
	</div>
	<div id="minimata" style="margin-top: 0px;">
	</div>
	<?php
}
?>
