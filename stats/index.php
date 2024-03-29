<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Page::head();
Page::stylesheet('lib/forma');
Page::stylesheet('stats/stats');
Page::javascript('stats/stats');
Page::body();
Prefadoros::pektis_check(FALSE, TRUE, TRUE);
if (Globals::perastike('pektis')) {
	$pektis = $_REQUEST['pektis'];
}
elseif ($globals->is_pektis()) {
	$pektis = $globals->pektis->login;
}
else {
	$pektis = "";
}
?>
<script type="text/javascript">
//<![CDATA[
<?php
if (Globals::perastike('pedi')) {
	$pedi = TRUE;
	?>
	Stats.pedi = true;
	<?php
}
else {
	$pedi = FALSE;
}
if (Globals::perastike('sort')) {
	?>
	Stats.sort = '<?php print $_REQUEST['sort']; ?>';
	<?php
}
if (Globals::perastike('pektis')) {
	?>
	Stats.onoma = '<?php print $_REQUEST['pektis']; ?>';
	<?php
}
?>
//]]>
</script>
<?php
Page::epikefalida($pedi);
Page::fyi();
// Το παρακάτω κομμάτι έως το __END__ είναι πρόσθετο.
//	<div class="simantiko" style="left: 1.2cm;">
//	Η σελίδα της βαθμολογίας θα παραμείνει κλειστή καθώς φαίνεται
//	να πυροδοτεί διαπληκτισμούς και άλλα λυπηρά φαινόμενα μεταξύ των παικτών.
//	Τέτοιου είδους φαινόμενα, δεν είναι στο πνεύμα του ιστοτόπου και
//	εφόσον συνεχιστούν, ο «Πρεφαδόρος» θα παραμείνει προσβάσιμος
//	μόνο από επιλεγμένους παίκτες με τους οποίους μπορώ να έχω
//	προσωπική επαφή και για τους οποίους κρίνω ότι αντιλαμβάνονται
//	τον ανοικτό χαρακτήρα του ιστοτόπου και μπορούν να διαχειριστούν
//	την ελευθερία που παρέχει το πρόγραμμα.
//	</div>
// __END__
?>
<span class="formaPrompt">Παίκτης</span>
<input id="pektis" type="text" class="formaField" value="<?php
	print $pektis; ?>" onchange="Stats.setOnoma(this, true);" />
<img src="<?php print $globals->server; ?>images/fakos.png" alt=""
	style="width: 0.6cm; margin-bottom: -0.15cm; cursor: pointer;"
	title="Εντοπισμός παίκτη" onclick="Stats.setOnoma(getelid('pektis'), true);" />
<div style="display: inline-block; margin-left: 0.8cm;">
(<span style="font-style: italic;">για τη μέθοδο αξιολόγησης διαβάστε
<a target="_blank" href="http://wp.me/p1wjyj-60">εδώ</a></span>)
</div>
<div style="min-height: 12.0cm;">
	<?php print_stats($pektis); ?>
</div>
<?php
Page::close();

function print_stats($pektis = "") {
	global $globals;

	$file = "rank";
	if (Globals::perastike('sort') && ($_REQUEST['sort'] != "")) {
		$file .= "." . $_REQUEST['sort'];
	}
	$file .= ".txt";
	$fp = @fopen($file, "r");
	if (!$fp) {
		?>
		<div>
			<?php print ($file . ": cannot open file"); ?>
		</div>
		<?php
		return;
	}

	?>
	<table style="margin-top: 0.2cm;">
	<tr class="statsEpikefalida">
		<th>
			<span class="nobr">Α/Α</span>
		</th>
		<th span onclick="Stats.setSort();" title="Ταξινόμηση ως προς όνομα"
			style="cursor: pointer;">
			Παίκτης
		</th>
		<th>
			Παρτίδες
		</th>
		<th onclick="Stats.setSort('dianomi');" title="Ταξινόμηση ως προς πλήθος διανομών"
			style="cursor: pointer;">
			Διανομές
		</th>
		<th>
			Καπίκια
		</th>
		<th>
			Μουαγέν
		</th>
		<th onclick="Stats.setSort('bathmos');" title="Ταξινόμηση ως προς βαθμό"
			style="cursor: pointer;">
			Βαθμός
		</th>
		<th>
		</th>
	</tr>
	<?php
	$pkok = TRUE;
	$n = 0;
	while ($row = fgets($fp)) {
		$cols = explode("\t", $row);
		if (count($cols) < 5) {
			continue;
		}

		$sp = sin_plin($cols[5]);
		$pk = ($pektis != "") && preg_match("/" . $pektis . "/", $cols[0]);
		print '<tr class="zebra' . ($n++ % 2);
		if ($pk) {
			print " statsEgo";
		}
		print '">';
		print '<td class="statsPlithos statsAa">' . $n . '</td>';
		print '<td class="statsPektis' . $sp . '">';
		if ($pk && $pkok) {
			print '<a name="pkspot"></a>';
			$pkok = FALSE;
		}
 		print $cols[0] . '</td>';
		print '<td class="statsPlithos">' . $cols[1] . '</td>';
		print '<td class="statsPlithos">' . $cols[2] . '</td>';
		print '<td class="statsPlithos">' . $cols[3] . '</td>';
		print '<td class="statsBathmos' . $sp . '">' . $cols[4] . '</td>';
		print '<td class="statsBathmos' . $sp . '">' . $cols[5] . '</td>';
		print '<td><a href="#" onclick="getelid(\'pektis\').select(); return true;">' .
			'<img src="' . $globals->server . 'images/dixePano.png" ' .
				'title="Εντοπισμός παίκτη" class="statsPano" alt="" /></a>';
		print '</tr>';
	}

	fclose($fp);
	?>
	</table>
	<?php
}

function sin_plin($x) {
	if ($x > 0) {
		return ' statsThetikos';
	}
	elseif ($x < 0) {
		return ' statsArnitikos';
	}
	else {
		return '';
	}
}
?>
