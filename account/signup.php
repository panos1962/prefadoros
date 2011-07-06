<?php
require_once '../lib/standard.php';
set_globals();
if ($globals->is_pektis()) {
	$pektis = $globals->pektis->login;
}
else {
	$pektis = NULL;
}
Page::head();
Page::stylesheet('lib/forma');
Page::javascript('lib/forma');
Page::javascript('account/account');
?>
<div class="mainArea">
<form class="forma" method="post" action="<?php print $globals->server; ?>index.php">
<table class="formaData tbldbg">
<tr>
	<td class="formaHeader tbldbg" colspan="2">
		<?php print (isset($pektis) ? 'Update' : 'Create'); ?> account
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Login
	</td>
	<td class="tbldbg">
		<input name="login" id="login" type="text" maxlength="32"
			size="32" class="formaField"
			<?php
			if (isset($pektis)) {
				?>
				value="<?php print $pektis; ?>" disabled
				style="font-weight: bold;"
				<?php
			}
			else {
				?>
				value="" onkeyup="account.checkLoginOnline(this);"
				onchange="account.loginAvailable(this);"
				<?php
			}
			?> />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Name
	</td>
	<td class="tbldbg">
		<input id="onoma" name="onoma" type="text" maxlength="128" size="50" value="<?php
			if (isset($pektis)) {
				print $globals->pektis->onoma;
			}
			?>" class="formaField" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Email
	</td>
	<td class="tbldbg">
		<input name="email" type="text" maxlength="64" size="50" value="<?php
			if (isset($pektis)) {
				print $globals->pektis->email;
			}
			?>" onkeydown="this.style.color=globals.color.ok;"
			onblur="account.checkEmailValue(this);" class="formaField" />
	</td>
</tr>
<?php
if ($pektis) {
	?>
	<tr>
		<td class="formaPrompt tbldbg">
			Current Password
		</td>
		<td class="tbldbg">
			<input name="password" type="password" maxlength="50"
				size="16" value="@@@@@@@@" class="formaField" />
		</td>
	</tr>
	<?php
}
?>
<tr>
	<td class="formaPrompt tbldbg">
		Password
	</td>
	<td class="tbldbg">
		<input name="password1" type="password" maxlength="50" size="16"
			value="" class="formaField" />
	</td>
</tr>
<tr>
	<td class="formaPrompt tbldbg">
		Repeat
	</td>
	<td class="tbldbg">
		<input name="password2" type="password" maxlength="50" size="16"
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
		<input type="submit" value="<?php
			print (isset($pektis) ? 'Update' : 'Create') ; ?> account"
			class="button formaButton" onclick="return account.<?php
				print (isset($pektis) ? 'update' : 'add' ); ?>Pektis(this.form);" />
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
</div>
<?php
Page::close();
?>
