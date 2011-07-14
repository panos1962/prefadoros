<?php
header('Content-type: application/json; charset=utf-8');
global $no_session;
$no_session = TRUE;
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../prefadoros/prefadoros.php';

class Sxesi {
	public $login;
	public $onoma;
	public $online;
	public $sxesi;

	public function __construct() {
		$this->login = '';
		$this->onoma = '';
		$this->online = 0;
		$this->sxesi = '';
	}

	public function set_row($row, $sxesi = '') {
		$this->login = $row['login'];
		$this->onoma = $row['όνομα'];
		$this->online = ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX ? 1 : 0);
		$this->sxesi = $sxesi;
	}

	public function set_data($row, $sxesi = '') {
		$this->login = $row['login'];
		$this->onoma = $row['όνομα'];
		$this->online = ($row['idle'] < XRONOS_PEKTIS_IDLE_MAX ? 1 : 0);
		$this->sxesi = $sxesi;
	}

	public function print_data() {
		print $this->login . "\t" . $this->onoma . "\t" . $this->online .
			"\t" . $this->sxesi;
	}
}

set_globals();
Prefadoros::pektis_check();

$globals->pektis->poll_update();
for ($xronos = 0; $xronos < XRONOS_DEDOMENA_MAX; $xronos += XRONOS_DEDOMENA_TIC) {
	usleep(XRONOS_DEDOMENA_TIC);
	$xronos += XRONOS_DEDOMENA_TIC;
	process_sxesi();
}

function process_sxesi() {
	global $globals;

	$sxesi = array();
	$pektis = "'" . $globals->asfales($globals->pektis->login) . "'";

	$query1 = "SELECT `login`, `όνομα`, (`poll` - NOW()) AS `idle` " .
		"FROM `παίκτης` WHERE 1 ";

	if (Globals::perastike('spat')) {
		$pat = "'%" . $globals->asfales($_REQUEST['spat']) . "%'";
		$query1 .= "AND ((`όνομα` LIKE " . $spat . ") OR " .
			"(`login` LIKE " . $spat . ")) ";
	}

	if (Globals::perastike('skat')) {
		$query1 .= "AND (`idle` < " . XRONOS_PEKTIS_IDLE_MAX . ") ";
	}

	$query2 = " ORDER BY `login`";

	$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
		"(`παίκτης` LIKE " . $pektis . ") AND " .
		"(`status` LIKE 'ΦΙΛΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$s = new Sxesi;
		$s->set_row($row, 'ΦΙΛΟΣ');
		$sxesi[] = $s;
	}

	if (!Globals::perastike('sxet')) {
		$query = $query1 . "AND (`login` NOT IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
			"(`παίκτης` LIKE " . $pektis . ")))" . $query2;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$s = new Sxesi;
			$s->set_row($row);
			$sxesi[] = $s;
		}
	}

	$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
		"(`παίκτης` LIKE " . $pektis . ") AND " .
		"(`status` LIKE 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$s = new Sxesi;
		$s->set_row($row, 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
		$sxesi[] = $s;
	}
var_dump($sxesi);
die(0);
}

$id = mt_rand();
print <<<DOC
data: {
	pektis:		'{$globals->pektis->login}',
	prosklisi:	'AA',
	id:		{$id}
DOC;

print <<<DOC
}
DOC;
die('@OK');
?>
