<?php
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
?>
<style type="text/css">
.main {
	position: relative;
	min-height: 12.0cm;
}

.irisIcon {
	position: absolute;
	top: 0.4cm;
	left: 1.0cm;
	width: 0px;
	transition: width 1s ease-out;
	-webkit-transition: width 1s ease-out;
	-moz-transition: width 1s ease-out;
	-o-transition: width 1s ease-out;
}

.oopsIcon {
	position: absolute;
	top: 1.0cm;
	left: 3.0cm;
	width: 4.0cm;
	transition: width 700ms ease-in 3s;
	-webkit-transition: width 700ms ease-in 3s;
	-moz-transition: width 700ms ease-in 3s;
	-o-transition: width 700ms ease-in 3s;
}
</style>
<?php
Page::body();
Page::epikefalida();
?>
<script type="text/javascript">
//<![CDATA[
window.onload = function() {
	var x = getelid('iris');
	if (notSet(x)) { return; }
	x.style.width = '2.0cm';

	x = getelid('oops');
	if (notSet(x)) { return; }
	x.style.width = '0px';
};
//]]>
</script>
<div class="main">
<img id="iris" class="irisIcon" src="<?php print $globals->server;
	?>images/iris.gif" alt="" alt="inaccessible data" />
<img id="oops" class="oopsIcon" src="<?php print $globals->server;
	?>images/oops.gif" alt="" alt="" />
</div>
<?php
Page::close();
$globals->klise_fige();
