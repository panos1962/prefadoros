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

	public static function is_online($idle) {
		return ($idle < XRONOS_PEKTIS_IDLE_MAX ? 1 : 0);
	}

	public function __construct() {
		$this->login = '';
		$this->onoma = '';
		$this->online = 0;
		$this->status = '';
	}

	public function set_row($row, $status = '') {
		$this->login = $row['login'];
		$this->onoma = $row['όνομα'];
		$this->online = self::is_online($row['idle']);
		$this->status = $status;
	}

	public function set_data($login, $onoma, $idle, $status = '') {
		$this->login = $row['login'];
		$this->onoma = $row['όνομα'];
		$this->online = self::is_online($idle);
		$this->status = $status;
	}

	public function raw_data() {
		print $this->login . "\t" . $this->onoma . "\t" . $this->online .
			"\t" . $this->sxesi;
	}

	public function json_data() {
		print "{l:'" . $this->login . "',n:'" . $this->onoma .
			"o:" . $this->online .  "s:'" . $this->sxesi . "'}";
	}
}

set_globals();
Prefadoros::pektis_check();

global $slogin;
$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";

$globals->pektis->poll_update();
$ekinisi = time();
do {
	process_sxesi();
	usleep(XRONOS_DEDOMENA_TIC);
} while ((time() - $ekinisi) < XRONOS_DEDOMENA_MAX);

function process_sxesi() {
	global $globals;
	global $slogin;

	$sxesi = array();

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
		"(`παίκτης` LIKE " . $slogin . ") AND " .
		"(`status` LIKE 'ΦΙΛΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$s = new Sxesi;
		$s->set_row($row, 'ΦΙΛΟΣ');
		$sxesi[] = $s;
	}

	if (!Globals::perastike('sxet')) {
		$query = $query1 . "AND (`login` NOT IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
			"(`παίκτης` LIKE " . $slogin . ")))" . $query2;
		$result = $globals->sql_query($query);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$s = new Sxesi;
			$s->set_row($row);
			$sxesi[] = $s;
		}
	}

	$query = $query1 . "AND (`login` IN (SELECT `σχετιζόμενος` FROM `σχέση` WHERE " .
		"(`παίκτης` LIKE " . $slogin . ") AND " .
		"(`status` LIKE 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ')))" . $query2;
	$result = $globals->sql_query($query);
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$s = new Sxesi;
		$s->set_row($row, 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
		$sxesi[] = $s;
	}
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
