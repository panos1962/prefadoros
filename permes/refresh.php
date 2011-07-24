<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

$time_dif = Globals::perastike_check('timeDif');

$query = "SELECT *, UNIX_TIMESTAMP(`δημιουργία`) AS `πότε` FROM `μήνυμα` WHERE ";
if (Globals::perastike('exer') && Globals::perastike('iser')) {
	$query .= "(`αποστολέας` LIKE " . $slogin . ") OR " .
		"(`παραλήπτης` LIKE " . $slogin . ")";
}
elseif (Globals::perastike('exer')) {
	$query .= "(`αποστολέας` LIKE " . $slogin . ")";
}
elseif (Globals::perastike('iser')) {
	$query .= "(`παραλήπτης` LIKE " . $slogin . ")";
}
else {
	die(0);
}
$query .= " ORDER BY `κωδικός` DESC LIMIT 30";
$result = $globals->sql_query($query);
?>
<table width="100%" cellspacing="10 0 0 0">
<?php
for ($i = 0; $row = mysqli_fetch_array($result, MYSQLI_ASSOC); $i++) {
	$apostoleas = $row['αποστολέας'] == $globals->pektis->login ? '' : $row['αποστολέας'];
	$paraliptis = $row['παραλήπτης'] == $globals->pektis->login ? '' : $row['παραλήπτης'];
	if (($apostoleas == '') && ($paraliptis == '')) {
		$apostoleas = $row['αποστολέας'];
	}
	$diavasmeno = $row['κατάσταση'] == 'ΔΙΑΒΑΣΜΕΝΟ' ? 'permesDiavasmeno' : '';
	?>
	<tr id="minima<?php print $row['κωδικός']; ?>">
	<td class="permesApo" <?php
		if ($apostoleas != '') {
			?>
			onclick="Permes.sinthesi('<?php print $apostoleas; ?>');"
			title="Απάντηση" style="cursor: pointer;"
			<?php
		}
		?>>
		<?php print $apostoleas; ?>
	</td>
	<td class="permesPros" <?php
		if ($paraliptis != '') {
			?>
			onclick="Permes.sinthesi('<?php print $paraliptis; ?>');"
			title="Νέο μήνυμα" style="cursor: pointer;"
			<?php
		}
		?>>
		<?php print $paraliptis; ?>
	</td>
	<td class="zebra<?php print $i % 2; ?> permesMinima">
		<div id="text<?php print $row['κωδικός']; ?>" class="<?php print $diavasmeno; ?>">
			<?php
			$minima = preg_replace("/\n/", "<br />", $row['μήνυμα']);
			print $minima;
			?>
			<span class="permesXronosArea">[<span class="permesXronos"><?php
				print Xronos::pote($row['πότε'], $time_dif); ?></span>]</span>
		</div>
	</td>
	<td style="vertical-align: top;">
		<?php
		if ($row['παραλήπτης'] == $globals->pektis->login) {
			?>
			<img class="permesIcon" title="Διαγραφή" src="<?php
				print $globals->server; ?>images/Xred.png" alt=""
				onclick="Permes.diagrafi(this, <?php print $row['κωδικός']; ?>);" />
			<?php
		}
		?>
	</td>
	<td style="vertical-align: top;">
		<?php
		if ($row['παραλήπτης'] == $globals->pektis->login) {
			katastasi_panel($row['κωδικός'], $row['κατάσταση']);
		}
		?>
	</td>
	</tr>
	<?php
}
?>
</table>
<?php

function katastasi_panel($minima, $katastasi) {
	global $globals;

	if ($katastasi == 'ΝΕΟ') {
		?>
		<img class="permesIcon" title="Νέο!" src="<?php
			print $globals->server; ?>images/important.png"
			onclick="Permes.katastasi(this, <?php
				print $minima; ?>, 'ΔΙΑΒΑΣΜΕΝΟ');" alt="" />
		<?php
	}
	else {
		?>
		<img class="permesIcon" title="Διαβάστηκε" src="<?php
			print $globals->server; ?>images/controlPanel/check.png"
			onclick="Permes.katastasi(this, <?php
				print $minima; ?>, 'ΝΕΟ');" alt="" />
		<?php
	}
}
?>
