<?php
require_once '../lib/standard.php';
unset($_SESSION['ps_login']);
unset($_SESSION['ps_paraskinio']);
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('account/account');
Page::body();
Page::epikefalida(FALSE);
Page::fyi();
?>
<div class="mainArea">
<form class="forma" method="post" action="<?php print $globals->server; ?>index.php"
	style="margin-top: padding-top: 1em;">
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
			onclick="return account.loginCheck(this.form);" />
	</td>
	<td class="tbldbg">
		<input type="reset" value="Reset" class="button formaButton" />
	</td>
	<td class="tbldbg">
		<input type="button" value="Cancel" class="button formaButton"
			onclick="return exitChild();" />
	</td>
</tr>
</table>
</form>
</div>
<?php
Page::close();
?>
