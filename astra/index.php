<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Page::head();
Page::stylesheet('astra/astra');
Page::stylesheet('lib/forma');
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
		type="text" size="20" maxlength="1024" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Από</div>
	<input class="formaField" value=""
		type="text" size="10" maxlength="10" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Έως</div>
	<input class="formaField" value=""
		type="text" size="10" maxlength="10" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Παρτίδα</div>
	<input class="formaField" value="" type="text" size="10" maxlength="10" />
</div>
</div>
<?php
Page::close();
?>
