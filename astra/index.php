<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::stylesheet('astra/astra');
Page::javascript('lib/forma');
Page::javascript('astra/astra');
Page::body();
Prefadoros::pektis_check(FALSE, TRUE, TRUE);
Prefadoros::set_trapezi();
Page::epikefalida(Globals::perastike('pedi'), "[<a target=\"_blank\" href=\"" .
	$globals->server . "stats/index.php?pedi=yes\" ".
	"title=\"Βαθμολογία παικτών που έχουν παίξει πάνω από 1.000 διανομές\">Βαθμολογία</a>]");
Page::fyi();
?>
<div id="astraArea" class="mainArea astraArea">
<div id="ruler" style="width: 10.0cm; height: 1px;"></div>
<form onsubmit="return Astra.getData();" class="astraInputArea">
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Παίκτης</div>
	<input id="pektis" class="formaField" value="<?php print $globals->pektis->login; ?>"
		type="text" maxlength="1024" style="width: 4.0cm;"/>
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Από</div>
	<input id="apo" class="formaField" value=""
		type="text" maxlength="10" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Έως</div>
	<input id="eos" class="formaField" value=""
		type="text" maxlength="10" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<div class="formaPrompt astraPrompt">Παρτίδα</div>
	<input id="partida" class="formaField" value="<?php
		if ($globals->is_trapezi()) {
			print $globals->trapezi->kodikos;
		}
		?>" type="text" maxlength="128" style="width: 2.0cm;" />
</div>
<div class="astraInput">
	<img id="searchIcon" class="astraSearchIcon" src="<?php
		print $globals->server; ?>images/workingRed.gif" alt="" />
	<input class="formaField astraGo" value="Go!!!" type="submit" />
</div>
</form>
<div id="dataArea" class="astraDataArea"></div>
</div>
<?php
Page::close();
?>
