<?php
require_once 'lib/standard.php';
set_globals();
Page::head();
Page::stylesheet('lib/prefadoros');
Page::javascript('lib/prefadoros');
Page::body();
Page::motd();
Page::diafimisi();
Page::toolbar();
?>
<div class="mainArea">
<table class="tldbg" width="100%">
<tbody>
<tr>
<td class="tbldbg" style="width: 14.0cm;">
	<div id="prefadoros" class="prefadoros">
		Τραπέζι
	</div>
</td>
<td class="tbldbg" style="width: 1.0cm; vertical-align: top;">
	CP
</td>
<td class="tbldbg" style="vertical-align: top;">
	<div class="PSSHeaderArea">
		Προσκλήσεις
	</div>
	<div class="PSSArea prosklisiArea">
		Προσκλήσεις
	</div>
	<div class="PSSHeaderArea">
		Σχέσεις
	</div>
	<div class="PSSArea sxesiArea">
		Σχέσεις
	</div>
	<div class="PSSHeaderArea">
		Συζήτηση
	</div>
	<div class="PSSArea sizitisiArea">
		Συζήτηση
	</div>
</td>
<td class="tbldbg" style="width: 1.0cm; vertical-align: top;">
xxx
</td>
</tr>
</tbody>
</table>
</div>
<?php
Page::close();
?>
