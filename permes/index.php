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
Page::body();
Page::epikefalida(Globals::perastike('pedi'));
Page::fyi();
Prefadoros::pektis_check();
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
	<div style="width: 11.0cm;">
	<textarea id="permesInput" rows="14" cols="60">
	</textarea>
	<div id="formaFyi" class="fyi formaFyi">&#xfeff;</div>
	<input class="button formaButton" type="submit" value="Αποστολή"
		onclick="return Permes.apostoli();" />
	<input class="button formaButton" type="reset" value="Reset"
		onclick="return Permes.reset();" />
	<input class="button formaButton" type="submit" value="Άκυρο"
		onclick="Permes.cancel(); return false;" />
	</div>
	<script type="text/javascript">
	//<![CDATA[
	Permes.paraliptis = '<?php print $_REQUEST['pros']; ?>';
	//]]>
	</script>
	<?php
}

function minimata() {
	global $globals;
	$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";
	?>
	<div style="margin-top: 0px;">
	Εισερχόμενα <input id="iser" type="checkbox" checked="yes" onchange="Permes.refresh();" />
	Εξερχόμενα <input id="exer" type="checkbox" onchange="Permes.refresh();" />
	</div>
	<div id="minimata" style="margin-top: 0px;">
AAA
	</div>
	<?php
}
?>
