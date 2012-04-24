<?php
require_once '../lib/standard.php';
set_globals(TRUE);
Page::head();
Page::administrator_check();

$klista_selida = "../" . KLISTA_SELIDA;
$tora_klista = file_exists($klista_selida);

switch ($globals->perastike_check("mode")) {
case 'klise':
	$tora_klise = TRUE;
	break;
case 'anixe':
	$tora_klise = FALSE;
	break;
default:
	$globals->klise_fige('Περάστηκε λανθασμένη τιμή παραμέτρου "mode"');
	break;
}

$fyi = "";
$ok = TRUE;

if ($tora_klista && $tora_klise) {
	$fyi = "Ο «Πρεφαδόρος» είναι ήδη κλειδωμένος";
	$ok = FALSE;
}
elseif ((!$tora_klista) && (!$tora_klise)) {
	$fyi = "Ο «Πρεφαδόρος» είναι ήδη ξεκλειδωμένος";
	$ok = FALSE;
}
elseif ($tora_klise) {
	file_put_contents($klista_selida, 'Ο «Πρεφαδόρος» θα παραμείνει για λίγο κλειστός!');
	$fyi = "Kλείδωμα «Πρεφαδόρου». Παρακαλώ περιμένετε…";
}
else {
	unlink($klista_selida);
	$fyi = "Ξεκλείδωμα «Πρεφαδόρου». Παρακαλώ περιμένετε…";
}
?>
<script type="text/javascript">
window.onload = function() {
	init();
	var ok = <?php print ($ok ? "true" : "false"); ?>;
	mainFyi('<?php print $fyi; ?>');
	setTimeout(function() {
		window.close();
	}, 2000);
};
</script>
<?php
Page::body();
Page::epikefalida($globals->perastike("pedi"));
Page::fyi();
?>
<div class="mainArea" style="margin-left: 1.5cm;">
</div>
<?php
Page::close();
?>
