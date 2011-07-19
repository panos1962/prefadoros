<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
Page::data();
set_globals();

Prefadoros::pektis_check();
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

$query = "SELECT * FROM `μήνυμα` WHERE ";
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
$query .= " ORDER BY `κωδικός` LIMIT 30";
$result = $globals->sql_query($query);
?>
<table>
<?php
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	?>
	<tr>
	<td>
	<?php print $row['αποστολέας']; ?>
	</td>
	<td>
	<?php print $row['παραλήπτης']; ?>
	</td>
	<td>
	<?php
	$minima = preg_replace("/\n/", "<br />", $row['μήνυμα']);
	print $minima;
	?>
	</td>
	</tr>
	<?php
}
?>
</table>
