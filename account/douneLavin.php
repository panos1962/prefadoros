<?php
require_once('../lib/standard.php');
set_globals();
$errmsg = "account/douneLavin.php: ";

if (!$globals->is_pektis()) {
	telos('Ακαθόριστος παίκτης');
}

if (!perastike('emfanisi')) {
	$emfanisi = 'YES';
}
else {
	$emfanisi = $_REQUEST['emfanisi'];
}

$query = "UPDATE `παίκτης` SET `καπίκια` = '" . $emfanisi . "' " .
	"WHERE `login` LIKE '" . asfales($globals->pektis->login) . "'";
$result = @mysqli_query($globals->db, $query);
if (!$result) {
	sfalma_sql($errmsg);
}

telos();
?>
