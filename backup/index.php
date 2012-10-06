<?php
die(0);
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
Page::administrator_check();
Page::stylesheet('backup/backup');
Page::stylesheet('lib/forma');
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
		<div class="forma" style="font-weight: normal; padding-top: 0px; padding-left: 1.2cm;">
		<table class="formaData tbldbg">
		<tr>
			<td class="formaPrompt tbldbg">
				Από&nbsp;τραπέζι
			</td>
			<td class="tbldbg">
				<input id="apoTrapezi" type="text" value="1" size="10" maxlength="10"
					onchange="Backup.checkApoTrapezi();" class="formaField" />
			</td>
		</tr>
		</table>
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
	<td id="sxesiStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="sxesi" class="data">Σχέσεις</span>
	</td>
	<td id="sxesiCount" class="backupCount">
	</td>
</tr>
<tr>
	<td id="minimaStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="minima" class="data">Μηνύματα</span>
	</td>
	<td id="minimaCount" class="backupCount">
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
	<td id="dianomiStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="dianomi" class="data">Διανομές</span>
	</td>
	<td id="dianomiCount" class="backupCount">
	</td>
</tr>
<tr>
	<td id="kinisiStatus" class="backupStatus">
	</td>
	<td class="backupPinakas">
		<span id="kinisi" class="data">Κινήσεις</span>
	</td>
	<td id="kinisiCount" class="backupCount">
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
	<td id="ekinisi" class="backupPinakas" colspan="100">
		<button id="startupButton" class="backupButton" type="button"
			onclick="return Backup.ekinisi();">Start backup</button>
	</td>
</tr>
</tbody>
</table>
</div>
<?php
Page::close();
?>
