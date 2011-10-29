<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::stylesheet('astra/astra');
Page::javascript('lib/forma');
Page::javascript('astra/astra');
Page::body();
Prefadoros::pektis_check();
Page::epikefalida(Globals::perastike('pedi'));
Page::fyi();
?>
<div id="astraArea" class="mainArea astraArea">
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Παίκτης</div>
	<input class="formaField" value="<?php print $globals->pektis->login; ?>"
		type="text" maxlength="1024" style="width: 4.0cm;"/>
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Από</div>
	<input class="formaField" value=""
		type="text" maxlength="10" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Έως</div>
	<input class="formaField" value=""
		type="text" maxlength="10" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Παρτίδα</div>
	<input class="formaField" value="" type="text"
		maxlength="10" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<input class="formaField astraGo" value="Go!!!" type="button"
		onclick="Astra.getData();" />
</div>
</div>
<?php
Page::close();
?>
