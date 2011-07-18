<?php
require_once '../lib/standard.php';
set_globals();
Page::head();
Page::stylesheet('permes/permes');
Page::stylesheet('lib/forma');
Page::javascript('permes/permes');
Page::body();
Page::epikefalida(Globals::perastike('pedi'));
?>
<div class="mainArea permesArea">
<?php
if (Globals::perastike('pros')) {
	minima_pros();
}
else {
	minimata();
}
?>
</div>
<?php
Page::close();

function minima_pros() {
	?>
	<div style="padding-top: 1.0cm; padding-bottom: 0.4cm;">
	<span class="data">Αποστολή προσωπικού μηνύματος προς <span class="pros"><?php
		print $_REQUEST['pros']; ?></span></span>
	</div>
	<textarea id="permesInput" rows="14" cols="60">
	</textarea>
	<div style="padding-top: 0.4cm;">
	<input class="button formaButton" type="submit" value="Αποστολή" />
	<input class="button formaButton" type="submit" value="Άκυρο" />
	</div>
	<?php
}

function minimata() {
	?>
	<div>
	Διαχείριση μηνυμάτων
	</div>
	<?php
}
?>
