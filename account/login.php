<?php
require_once('../lib/standard.php');
set_globals(TRUE);
include_javascript('account/standard.js');
arxi_selidas();
?>
<form class="forma" method="post" action="<?php print $globals->server; ?>index.php" >
<table class="formaData tbldbg">
<tr>
	<td class="formaHeader tbldbg" colspan="2">
		Φόρμα εισόδου
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Login
	</td>
	<td class="tbldbg">
		<input name="login" id="login" type="text" maxlength="32" size="32"
			value="" class="formaField" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Password
	</td>
	<td class="tbldbg">
		<input name="password" type="password" maxlength="50" size="16"
			value="" class="formaField" />
	</td>
</tr>
<tr>
	<td colspan="2">
		&#xfeff;<span id="formaFyi" class="fyi formaFyi"></span>
	</td>
</tr>
</table>
<table class="formaPanel tbldbg">
<tr>
	<td class="tbldbg">
		<input type="submit" value="Login" class="button formaButton"
			onclick="return loginCheck(this.form);" />
	</td>
	<td class="tbldbg">
		<input type="reset" value="Reset" class="button formaButton" />
	</td>
	<td class="tbldbg">
		<input type="button" value="Cancel" class="button formaButton"
			onclick="location.href='<?php print $globals->server; ?>/index.php'" />
	</td>
</tr>
</table>
</form>
<?php
telos_selidas();
?>
