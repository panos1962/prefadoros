<?php
require_once('../lib/standard.php');
set_globals(TRUE);
Page::head();
Page::check_administrator();
Page::stylesheet('lib/menu');
Page::javascript('administrator/administrator');
Page::body();
Page::epikefalida();
?>
<div class="mainArea">
<div class="menu">
<div class="menuHeader">
	ADMINISTRATOR MENU
</div>
<ul style="margin-bottom: 0;">
<li class="menuItem"><a href="<?php print $globals->server; ?>administrator/createdb/index.php"
	onclick="return confirm('All data will be destroyed!\n' +
		'Create a new, empty database?');">Create database</a></li>
<li class="menuItem">Backup database</li>
<li class="menuItem">Restore database</li>
<li class="menuItem"><a href="<?php print $globals->server; ?>/index.php"
	onclick="return exitAdministrator();">Exit administrator</a></li>
</ul>
</div>
</div>
<?php
Page::close();
?>
