<?php
require_once('../lib/standard.php');
set_globals(TRUE);
Page::head();
if ($globals->is_administrator()) {
	?>
	<meta http-equiv="refresh" content="0; url=<?php
		print $globals->server; ?>administrator/index.php">
	<?php
}
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('administrator/login');
Page::body();
Page::epikefalida();
// Το παρακάτω τμήμα προστέθηκε για αποφυγή επιθέσεων.
?>
<div class="mainArea">
<img src="<?php print $globals->server; ?>images/misc/iris.gif" />
</div>
</body>
</html>
<?php
die(0);
// Το παραπάνω τμήμα προστέθηκε για αποφυγή επιθέσεων.
?>
<div class="mainArea">
<form class="forma" method="post" action="<?php
	print $globals->server; ?>administrator/index.php">
<table class="formaData tbldbg">
<tr>
	<td class="formaHeader tbldbg" colspan="2">
		Administrator login
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Login
	</td>
	<td class="tbldbg">
		<input id="login" type="text" maxlength="30" size="20"
			value="Administrator" disabled class="formaField"
			style="font-weight: bold;" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Password
	</td>
	<td class="tbldbg">
		<input name="password" id="password" type="password"
			maxlength="30" size="20" class="formaField" />
	</td>
</tr>
<tr>
	<td class="tbldbg" colspan="2">
		<span id="formaFyi" class="fyi formaFyi">&nbsp;</span>
	</td>
</table>
<table class="formaPanel tbldbg">
<tr>
	<td class="tbldbg">
		<input type="submit" value="Login" class="button formaButton"
			onclick="return loginCheck(this.form);" />
	</td>
	<td class="formaButton tbldbg">
		<input type="reset" value="Reset" class="button formaButton" />
	</td>
	<td class="formaButton tbldbg">
		<input type="button" value="Cancel" class="button formaButton"
			onclick="window.close();" />
	</td>
</tr>
</table>
</form>
</div>
<?php
Page::close();
?>
