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
if (Globals::perastike('pedi')) {
	$pedi = TRUE;
	?>
	<script type="text/javascript">
	//<![CDATA[
	Stats.pedi = '&pedi=yes';
	//]]>
	</script>
	<?php
}
else {
	$pedi = FALSE;
}
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
	print $pektis; ?>" onchange="Stats.reload(this);" />
<img src="<?php print $globals->server; ?>images/fakos.png" alt=""
	style="width: 0.6cm; margin-bottom: -0.15cm; cursor: pointer;"
	title="Εντοπισμός παίκτη" onclick="Stats.reload(getelid('pektis'));" />
<?php
print_stats($pektis);
Page::close();

function print_stats($pektis = "") {
	global $globals;

	$file = "rank.txt";
	$fp = @fopen($file, "r");
	if (!$fp) {
		die($file . ": cannot open file");
	}

	?>
	<table style="margin-top: 0.2cm;">
	<tr class="statsEpikefalida">
		<th>
			Α/Α
		</th>
		<th>
			Παίκτης
		</th>
		<th>
			Παρτίδες
		</th>
		<th>
			Διανομές
		</th>
		<th>
			Καπίκια
		</th>
		<th>
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
		if (count($cols) != 5) {
			continue;
		}

		$sp = sin_plin($cols[4]);
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
