<?php
/*
Πρόκειται για πρόγραμμα το οποίο καλείται μέσω AJAX call και επιστρέφει
τα ονόματα των αρχείων εικόνας που βρίσκονται στο directory "gallery"
κάτω από το directory "images". Οι εικόνες αυτές προβάλλονται στο χώρο
του καφενείου όταν δεν υπάρχουν τραπέζια και οι περιφερόμενοι παίκτες
είναι λιγοστοί, οπότε υπάρχει αρκετός διαθέσιμος χώρος. Τα ονόματα
των αρχείων εικόνας επιστρέφονται ως comma separated list από strings.
*/

require_once '../lib/standard.php';
Page::data();
set_globals(TRUE);

$list = @scandir("../images/gallery");
if ($list === FALSE) { die(0); }
if (($n = count($list)) < 1) { die(0); }

$koma = "";
for ($i = 0; $i < $n; $i++) {
	if (preg_match("/\.(jpg|gif|png)$/i", $list[$i])) {
		print $koma . "'" . $list[$i] . "'";
		$koma = ",";
	}
}
?>
