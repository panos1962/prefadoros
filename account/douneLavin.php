<?php
require_once '../lib/standard.php';
set_globals();

if (!$globals->is_pektis()) {
	Globals::fatal('Ακαθόριστος παίκτης');
}

if (Globals::perastike('emfanisi')) {
	$emfanisi = $_REQUEST['emfanisi'];
}
else {
	$emfanisi = 'YES';
}

$query = "UPDATE `παίκτης` SET `καπίκια` = '" . $emfanisi . "' " .
	"WHERE `login` LIKE '" . Globals::asfales($globals->pektis->login) . "'";
$result = Globals::sql_query($query);
?>
