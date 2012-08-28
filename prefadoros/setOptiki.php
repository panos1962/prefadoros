<?php
require_once '../lib/standard.php';
Page::data();
set_globals();

$sinedria = Globals::perastike_check('sinedria');
$trapezi = Globals::perastike_check('trapezi');

$query = "UPDATE `sinedria` SET `trapezi` = " . $trapezi .
	", `sizitisidirty` = 2, `trapezidirty` = 2 WHERE `kodikos` = " . $sinedria;
@mysqli_query($globals->db, $query);
$globals->klise_fige();
