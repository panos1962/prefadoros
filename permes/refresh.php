<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();
$globals->time_dif = Globals::perastike_check('timeDif');

Prefadoros::pektis_check();

$query = "SELECT *, UNIX_TIMESTAMP(`dimiourgia`) AS `pote` FROM `minima` WHERE ";
if (Globals::perastike('exer') && Globals::perastike('iser')) {
	$query .= "(`apostoleas` = " . $globals->pektis->slogin . ") OR " .
		"(`paraliptis` = " . $globals->pektis->slogin . ")";
}
elseif (Globals::perastike('exer')) {
	$query .= "(`apostoleas` = " . $globals->pektis->slogin . ")";
}
elseif (Globals::perastike('iser')) {
	$query .= "(`paraliptis` = " . $globals->pektis->slogin . ")";
}
else {
	$globals->klise_fige();
}
$query .= " ORDER BY `kodikos` DESC LIMIT 30";
$result = $globals->sql_query($query);
?>
<table width="100%" cellspacing="10 0 0 0">
<?php
for ($i = 0; $row = mysqli_fetch_array($result, MYSQLI_ASSOC); $i++) {
	$apostoleas = $row['apostoleas'] == $globals->pektis->login ? '' : $row['apostoleas'];
	$paraliptis = $row['paraliptis'] == $globals->pektis->login ? '' : $row['paraliptis'];
	if (($apostoleas == '') && ($paraliptis == '')) {
		$apostoleas = $row['apostoleas'];
	}
	$diavasmeno = $row['katastasi'] == 'ΔΙΑΒΑΣΜΕΝΟ' ? 'permesDiavasmeno' : '';
	?>
	<tr id="minima<?php print $row['kodikos']; ?>">
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
		<div id="text<?php print $row['kodikos']; ?>" class="<?php print $diavasmeno; ?>">
			<?php
			$minima = preg_replace("/\n/", "<br />", $row['minima']);
			$minima = $globals::akirosi_script($minima);
			print $minima;
			?>
			<span class="permesXronosArea">[<span class="permesXronos"><?php
				print Xronos::pote($row['pote'], $globals->time_dif); ?></span>]</span>
		</div>
	</td>
	<td style="vertical-align: top;">
		<img class="permesIcon" title="Διαγραφή" src="<?php
			print $globals->server; ?>images/Xred.png" alt=""
			onclick="Permes.diagrafi(this, <?php print $row['kodikos']; ?>);" />
	</td>
	<td style="vertical-align: top;">
		<?php
		if ($row['paraliptis'] == $globals->pektis->login) {
			katastasi_panel($row['kodikos'], $row['katastasi']);
		}
		?>
	</td>
	</tr>
	<?php
}
?>
</table>
<?php
$globals->klise_fige();

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
