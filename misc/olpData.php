<?php

ob_start();
header('Content-type: text/json; charset=utf-8');

require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';

set_globals();
Prefadoros::set_pektis();

$tcount = trapezi_count();
$energos = energos_pektis();
$sxesi = sxesi();

print "login:" . ($globals->is_pektis() ?
	"'" . Globals::asfales_json($globals->pektis->login) . "'" : "null");
print ",tc:" . (int)$tcount;
print ",olp:[";

$n = count($energos);
for ($i = 0; $i < $n; $i++) {
	if (array_key_exists($energos[$i]->login, $sxesi) &&
		($sxesi[$energos[$i]->login] == "ΦΙΛΟΣ")) {
		$energos[$i]->json("f");
	}
}

for ($i = 0; $i < $n; $i++) {
	if (!array_key_exists($energos[$i]->login, $sxesi)) {
		$energos[$i]->json();
	}
}

for ($i = 0; $i < $n; $i++) {
	if (array_key_exists($energos[$i]->login, $sxesi) &&
		($sxesi[$energos[$i]->login] == "ΑΠΟΚΛΕΙΣΜΕΝΟΣ")) {
		$energos[$i]->json("b");
	}
}

print "]";
while (@ob_end_flush());
$globals->klise_fige();

class OLP {
	public $login;
	public $onoma;
	public $katastasi;
	public $sxesi;

	public function __construct($row) {
		$this->login = $row[0];
		$this->onoma = $row[1];
		$this->katastasi = $row[2];
	}

	public function json($sxesi = NULL) {
		static $koma = "";

		print $koma . "{l:'" . $this->login . "',o:'" .
			Globals::asfales_json($this->onoma) . "'";
		if (isset($sxesi)) {
			print ",s:'" . $sxesi . "'";
		}
		if ($this->katastasi == 'BUSY') {
			print ",b:1";
		}
		print "}";
		$koma = ",";
	}
}

function trapezi_count() {
	global $globals;

	$tcount = 0;
	$tora_ts = time() - XRONOS_PEKTIS_IDLE_MAX;
	$query = "SELECT COUNT(*) FROM `trapezi` " .
		"WHERE UNIX_TIMESTAMP(`poll`) > " .
		$tora_ts;
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$tcount = $row[0];
	}

	return($tcount);
}

function energos_pektis() {
	global $globals;

	$energos = array();
	$tora_ts = time() - XRONOS_PEKTIS_IDLE_MAX;
	$query = "SELECT `login`, `onoma`, `katastasi` " .
		"FROM `pektis` WHERE UNIX_TIMESTAMP(`poll`) > " .
		$tora_ts . " ORDER BY `login`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$energos[] = new OLP($row);
	}

	return($energos);
}

function sxesi() {
	global $globals;

	$sxesi = array();
	if (!$globals->is_pektis()) {
		return($sxesi);
	}

	$query = "SELECT `sxetizomenos`, `status` FROM `sxesi` " .
		"WHERE `pektis` = BINARY " . $globals->pektis->slogin;
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQL_NUM)) {
		$sxesi[$row[0]] = $row[1];
	}

	return($sxesi);
}