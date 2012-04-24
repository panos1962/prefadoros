<?php
require_once('../lib/standard.php');
set_globals(TRUE);
Page::head();
Page::administrator_check();
Page::stylesheet('lib/menu');
Page::javascript('administrator/administrator');
Page::body();
Page::epikefalida(TRUE);
?>
<div class="mainArea">
<div class="menu">
<div class="menuHeader">
	ADMINISTRATOR MENU
</div>
<ul style="margin-bottom: 0;">
<li class="menuItem"><a href="<?php print $globals->phpmyadmin; ?>"
	target="_blank">Manage database</a></li>
<li class="menuItem"><a href="<?php print $globals->server;
	?>backup/index.php?pedi=yes" target="_blank">Backup database</a></li>
<li class="menuItem">Restore database</li>
<li class="menuItem"><a href="<?php print $globals->server;
	?>administrator/anixeKlise.php?pedi=yes&mode=klise" target="_blank">Κλείδωμα «Πρεφαδόρου»</a></li>
<li class="menuItem"><a href="<?php print $globals->server;
	?>administrator/anixeKlise.php?pedi=yes&mode=anixe" target="_blank">Ξεκλείδωμα «Πρεφαδόρου»</a></li>
<li class="menuItem"><a href="<?php print $globals->server; ?>index.php"
	onclick="return exitAdministrator();">Exit administrator</a></li>
</ul>
</div>
</div>
<?php
Page::close();
?>
