<?php
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
Page::administrator_check();
Page::stylesheet('backup/backup');
Page::javascript('backup/backup');
Page::body();
Page::epikefalida($globals->perastike("pedi"));
Page::fyi();
?>
<div class="mainArea" style="margin-left: 1.5cm;">
<table>
<tbody>
<tr>
	<th colspan="10">
		<div class="backupEpikefalida">
			<span class="data">Database backup</span>
		</div>
	</th>
</tr>
<tr>
	<td id="pektisStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="pektis" class="data">Παίκτες</span>
	</td>
	<td id="pektisCount" class="backupCount">
	</td>
</tr>
<tr>
	<td id="trapeziStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="trapezi" class="data">Τραπέζια</span>
	</td>
	<td id="trapeziCount" class="backupCount">
	</td>
</tr>
<tr>
	<td id="sinedriaStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="sinedria" class="data">Συνεδρίες</span>
	</td>
	<td id="sinedriaCount" class="backupCount">
	</td>
</tr>
<tr>
	<td class="backupStatus">
	</td>
	<td class="backupPinakas" colspan="100">
		<button class="backupButton" style="margin-top: 0.4cm;" type="button"
			onclick="return Backup.pinakas('pektis');">Start backup</button>
	</td>
</tr>
</tbody>
</table>
</div>
<?php
Page::close();
?>
