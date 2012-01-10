<?php
require_once '../lib/standard.php';
set_globals();
$trapezi = Globals::perastike_check('trapezi');
Page::head("Πρεφαδόρος -- Παρτίδα " . $trapezi);
Page::stylesheet('movie/movie');
Page::javascript('movie/movie');
Page::body();
?>
<div id="main" class="movieMain">
	<div id="epikefalida" class="movieEpikefalida">
		<table width="100%" class="tbldbg">
		<tr>
		<td class="movieEpikefalidaLeft tbldbg">
		Παρτίδα <?php print $trapezi; ?>, κάσα 50
		</td>
		<td class="movieEpikefalidaRight tbldbg">
		Διανομή
		</td>
		</tr>
		</table>
	</div>
	<div id="trapezi" class="movieTrapezi">
		<div style="position: relative; height: 13.0cm;">
			<div class="moviePektisArea moviePektisArea3">
				3
			</div>
			<div class="moviePektisArea moviePektisArea2">
				2
			</div>
			<div class="moviePektisArea moviePektisArea1">
				1
			</div>
		</div>
	</div>
	<div class="movieControls">
		Controls
	</div>
</div>
<?php
Page::close(FALSE);
?>
