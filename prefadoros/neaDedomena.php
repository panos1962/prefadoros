<?php

ob_start();

define('PROCSTAT_FILE', "../PROCSTAT");
define('PROCSTAT_INTERVAL1', 2);
define('PROCSTAT_INTERVAL2', 10);

// Αρχικά θέτουμε το content type σε plain/text καθώς μπορεί να
// παρουσιαστούν σφάλματα τα οποία θα τυπωθούν ως απλό κείμενο.
// Αργότερα και ακριβώς πριν την αποστολή των data σε JSON format
// θα αλλάξουμε το content-type σε application/json.
header('Content-type: text/plain; charset=utf-8');

// Δεν θέλουμε session σε αυτό το πρόγραμμα, καθώς κάτι τέτοιο θα
// μπλοκάρει όλα τα υπόλοιπα requests που χρησιμοποιούν session
// cookies. Αυτό συμβαίνει διότι το παρόν πρόγραμμα τρέχει για
// αρκετά μεγάλο χρονικό διάστημα (αρκετά δευτερόλεπτα, ίσως και
// λεπτά) εκτελώντας συνεχείς επαναλαμβανόμενους ελέγχους στην
// database με μικρές ενδιάμεσες διακοπές της τάξης των 300 περίπου
// milliseconds. Εφόσον βρεθούν αλλαγές επιστρέφονται τα σχετικά
// δεδομένα και δρομολογείται σχεδόν αμέσως νέος κύκλος ελέγχου,
// ενώ αν δεν βρεθούν αλλαγές, το πρόγραμμα τερματίζει όταν φτάσει
// στον maximum χρόνο που έχει οριστεί και επαδρομολογείται πάλι
// νέος κύκλος ελέγχου.
global $no_session;
$no_session = TRUE;

require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/partida.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/kinisi.php';
require_once '../prefadoros/prosklisi.php';
require_once '../prefadoros/sxesi.php';
require_once '../prefadoros/permes.php';
require_once '../prefadoros/trapezi.php';
require_once '../prefadoros/rebelos.php';
require_once '../prefadoros/sizitisi.php';
require_once '../prefadoros/prefadoros.php';

global $monitor_fh;
open_monitor_file();

global $debug_buffer;
$debug_buffer = "";

set_globals();
$globals->time_dif = Globals::perastike_check('timeDif');

global $sinedria;
$sinedria = new Sinedria();
$sinedria->kodikos = Globals::perastike_check('sinedria');
$sinedria->fetch();

global $id;
$id = Globals::perastike_check('id');

// Όσον αφορά στη δημόσια συζήτηση (ΔΣ), φροντίζουμε να μας στέλνει ο client
// τον κωδικό του παλαιότερου σχολίου που είναι το πρώτο από αυτά που
// παρέλαβε την πρώτη φορά που ζήτησε δεδομένα στην τρέχουσα συνεδρία.
// Έτσι, μπορούμε να περιοριζόμαστε στα σχόλια της ΔΣ που είναι νεότερα
// από αυτό το αυτό το σχόλιο (συμπεριλαμβανομένου και αυτού).
//
// Την πρώτη φορά, δηλαδή κατά την εκκίνηση μιας συνεδρίας, ο client
// στέλνει κωδικό μηδέν, οπότε θα μαζευτούν τα τρέχοντα σχόλια της ΔΣ
// σύμφωνα με τη σταθερά "KAFENIO_TREXONTA_SXOLIA", ενώ μετά την πρώτη
// παραλαβή ο client θα εντοπίσει το παλαιότερο από τα σχόλια της ΔΣ
// αυτής της (πρώτης) παραλαβής και θα μας στέλνει έτοιμο τον κωδικό
// του παλαιοτέρου σχολίου, ώστε να ελέγχεται η ΔΣ από εκείνο το
// σχόλιο και ύστερα.

global $kafenio_apo;
$kafenio_apo = Globals::perastike_check('kafenioApo');

// Η global μεταβλητή "kiklos" μετράει τους κύκλους ελέγχου των
// δεδομένων. Είναι global καθώς την ελέγχω και μέσα από κάποιες
// από τις επιμέρους διαδικασίες.

global $kiklos;
$kiklos = 0;

// Στο σημείο αυτό θα προσπελάσουμε τον παίκτη με βάση το login
// name που περνάμε ως παράμετρο και θα ενημερώσουμε τόσο το
// πεδίο "poll" του παίκτη, που δείχνει πότε ο παίκτης έκανε
// την τελευταία κλήση για δεδομένα στον server, όσο και το
// πεδίο "id" της συνεδρίας, που δείχνει τον τελευταίο κύκλο
// ελέγχου στα πλαίσια της τρέχουσας συνεδρίας.

Prefadoros::pektis_check(Globals::perastike_check('login'));
Prefadoros::set_trapezi();

// Το πεδίο "sinedria->trapezi" δείχνει το τραπέζι του οποίου μας
// αφορά η συζήτηση, ή είναι μηδενικό εφόσον είμαστε στο καφενείο.

if ($globals->is_trapezi()) {
	// Αν μόλις έχουμε αλλάξει τραπέζι τότε θέτουμε το dirty
	// της συζήτησης για να ανανεωθεί η συζήτηση με τη συζήτηση
	// από το νέο τραπέζι. Θέτουμε επίσης το dirty του τραπεζιού
	// για να πάρουμε πληροφορία σχετική με τους θεατές.

	if (($sinedria->trapezi != 0) &&
		($sinedria->trapezi != $globals->trapezi->kodikos)) {
		$sinedria->trapezi = $globals->trapezi->kodikos;
		$sinedria->sizitisidirty = 1;
		$sinedria->trapezidirty = 1;
	}
}
elseif ($sinedria->trapezi > 0) {
	// Ήμασταν σε τραπέζι, αλλά τώρα δεν είμαστε σε τραπέζι.
	// Επομένως πρέπει να πάρω ανανεωμένη πληροφορία συζήτησης,
	// θεατών κλπ.

	$sinedria->trapezi = -2;
	$sinedria->sizitisidirty = 1;
	$sinedria->trapezidirty = 1;
}

$globals->pektis->poll_update($sinedria, $id);

global $procstat;
$procstat = new Procstat();

// Αν έχει περαστεί παράμετρος "freska", τότε ζητάμε όλα τα δεδομένα
// χωρίς να μπούμε στη διαδικασία της σύγκρισης με προηγούμενα
// δεδομένα της ίδιας συνεδρίας, οπότε μαζεύουμε τα τρέχοντα
// δεδομένα και τα επιστρέφουμε στον client.
monitor_write("freska");
if (Globals::perastike("freska")) {
	freska_dedomena(torina_dedomena());
	monitor_write("exit");
	$globals->klise_fige();
}

// Στο σημείο αυτό πρόκειται για κλασικό αίτημα αποστολής δεδομένων
// όπου θα πρέπει να μαζευτούν τα δεδομένα, να συγκριθούν με τα
// προηγούμενα δεδομένα της τρέχουσας συνεδρίας και, εφόσον υπάρχουν
// αλλαγές, να επιστραφούν τα νέα δεδομένα. Αν, παρ' όλα αυτά δεν
// μπορέσουμε να διαβάσουμε τα προηγούμενα δεδομένα από το σχετικό
// file, τότε επιστρέφουμε όλα τα δεδομένα, όπως ακριβώς κάναμε και
// στην περίπτωση αιτήματος "φρέσκων" δεδομένων. Τα αρχεία καταγραφής
// δεδομένων βρίσκονται στο directory "dedomena" και φέρουν το login
// name του παίκτη.
monitor_write("read");
$prev = new Dedomena();
if (!$prev->diavase()) {
	freska_dedomena(torina_dedomena());
	monitor_write("exit");
	$globals->klise_fige();
}

// Είμαστε στη φάση που έχουμε διαβάσει επιτυχώς από το σχετικό αρχείο
// τα δεδομένα της προηγούμενης αποστολής της τρέχουσας συνεδρίας και
// ξεκινάμε τον κύκλο ελέγχου με τα τρέχοντα στοιχεία της database.

$ekinisi = time();
usleep(XRONOS_DEDOMENA_TIC);
do {
	// Πριν προχωρήσουμε στο μάζεμα των στοιχείων και στον
	// συνακόλουθο έλεγχο, ελέγχουμε μήπως έχει δρομολογηθεί
	// ήδη νεότερος κύκλος ελέγχου/αποστολής στα πλαίσια
	// της τρέχουσας συνεδρίας. Αν όντως συμβαίνει κάτι
	// τέτοιο, τότε το πρόγραμμα απλώς τερματίζει επιστρέφοντας
	// σχετικά στοιχεία τερματισμού στον client, ώστε αυτός να
	// αγνοήσει τη συγκεκριμένη απάντηση.
	check_neotero_id();

	unset($globals->trapezi);
	Prefadoros::set_trapezi();
	$globals->pektis->check_dirty();
	$curr = torina_dedomena($prev);
	monitor_write("compare");
	$prev->trapezi_checked = $curr->trapezi_checked;
	if ($curr != $prev) {
		if (!$curr->trapezi_checked) {
			$curr->trapezi = Kafenio::process();
			$curr->rebelos = Rebelos::process();
			$curr->trapezi_checked = TRUE;
		}

		// Αποφεύγουμε κινήσεις τύπου "ΦΥΛΛΟ" και "ΠΛΗΡΩΜΗ" μετά
		// από κίνηση τύπου "ΜΠΑΖΑ" μαζί στην ίδια αποστολή.
		$curr->kinisi = Kinisi::fix_baza_filo($curr->kinisi, $prev->kinisi);
		diaforetika_dedomena($curr, $prev);
		monitor_write("exit");
		$globals->klise_fige();
	}

	// Εφόσον δεν υπάρχουν διαφορές, αφήνουμε ένα μικρό
	// χρονικό διάστημα και ξεκινάμε νέο μάζεμα δεδομένων
	// και συνακόλουθο έλεγχο. Εαν, όμως, ο συνολικός χρόνος
	// του τρέχοντος κύκλου ελέγχου/αποστολής έχει υπερβεί το
	// καθορισμένο maximum, τότε διακόπτουμε και επιστρέφουμε
	// δεδομένα που δείχνουν ότι τα δεδομένα παρέμειναν ίδια.
	// Ο client θα δρομολογήσει νέο κύκλο ελέγχου/αποστολής
	// στοιχείων.

	$kiklos++;
	if (($kiklos * XRONOS_DEDOMENA_TIC) < 3000000) {
		usleep(XRONOS_DEDOMENA_TIC);
		continue;
	}

	$elapsed = time() - $ekinisi;
	if ($elapsed < 5) {
		usleep(XRONOS_DEDOMENA_TIC1);
	}
	elseif ($elapsed < 7) {
		usleep(XRONOS_DEDOMENA_TIC2);
	}
	elseif ($elapsed < 10) {
		usleep(XRONOS_DEDOMENA_TIC3);
	}
	elseif ($elapsed > XRONOS_DEDOMENA_MAX) {
		print_epikefalida();
		print ",s:1}";
		monitor_write("exit (timeout)");
		$globals->klise_fige();
	}
	else {
		usleep(XRONOS_DEDOMENA_TIC4);
	}
} while (TRUE);

function check_neotero_id() {
	global $globals;
	global $sinedria;
	global $id;

	$sinedria->fetch();
	if ($sinedria->enimerosi != $id) {
		print_epikefalida();
		print "}";
		$globals->klise_fige();
	}
}

function print_epikefalida() {
	global $globals;
	global $sinedria;
	global $id;
	global $procstat;
	global $debug_buffer;

	// Για να έχουμε ενημερωμένα στοιχεία σχετικά με την κατάσταση
	// του παίκτη επαναπροσπελαύνουμε τον παίκτη πριν την επιστροφή.
	unset($globals->pektis);
	Prefadoros::pektis_check();

	header('Content-type: application/json; charset=utf-8');
	print "sinedria:{k:{$sinedria->kodikos},i:{$id}";
	if ($debug_buffer != "") { print ",debug:'" . $globals->asfales($debug_buffer) . "'"; }
	if ($globals->pektis->kapikia != 'YES') { print ",p:0"; }
	if ($globals->pektis->katastasi != 'AVAILABLE') { print ",b:0"; }
	if ($globals->pektis->blockimage) { print ",x:true"; }
	if (isset($procstat) && $procstat->calc) { printf(",l:%.0f", $procstat->load); }
}

class Dedomena {
	public $partida;
	public $dianomi;
	public $kinisi;
	public $prosklisi;
	public $sxesi;
	public $permes;
	public $trapezi;
	public $rebelos;
	public $sizitisi;
	public $kafenio;
	public $trapezi_checked;

	public function __construct() {
		$this->partida = NULL;
		$this->dianomi = array();
		$this->kinisi = array();
		$this->prosklisi = array();
		$this->sxesi = array();
		$this->permes = array();
		$this->trapezi = array();
		$this->rebelos = array();
		$this->sizitisi = array();
		$this->kafenio = array();
		$this->trapezi_checked = FALSE;
	}

	public function diavase() {
		global $globals;
		global $procstat;

		if (!$globals->klidoma($globals->pektis->login)) {
			Globals::fatal('cannot lock in order to read data file');
		}

		$fh = self::open_file('r');
		if (!$fh) {
			$globals->xeklidoma($globals->pektis->login);
			return(FALSE);
		}

		while ($line = Globals::get_line($fh)) {
			switch ($line) {
			case '@PARTIDA@':	Partida::diavase($fh, $this->partida); break;
			case '@DIANOMI@':	Dianomi::diavase($fh, $this->dianomi); break;
			case '@KINISI@':	Kinisi::diavase($fh, $this->kinisi); break;
			case '@PROSKLISI@':	Prosklisi::diavase($fh, $this->prosklisi); break;
			case '@SXESI@':		Sxesi::diavase($fh, $this->sxesi); break;
			case '@PERMES@':	Permes::diavase($fh, $this->permes); break;
			case '@TRAPEZI@':	Kafenio::diavase($fh, $this->trapezi); break;
			case '@REBELOS@':	Rebelos::diavase($fh, $this->rebelos); break;
			case '@SIZITISI@':	Sizitisi::diavase($fh, $this->sizitisi); break;
			case '@KAFENIO@':	Sizitisi::diavase($fh, $this->kafenio); break;
			case '@PROCSTAT@':	$procstat->diavase($fh);
			}
		}

		fclose($fh);
		$globals->xeklidoma($globals->pektis->login);
		return(TRUE);
	}

	public function grapse() {
		global $globals;
		global $procstat;

		if (!$globals->klidoma($globals->pektis->login)) {
			Globals::fatal('cannot lock in order to write data file');
		}

		$fh = self::open_file('w');
		if (!$fh) {
			$globals->xeklidoma($globals->pektis->login);
			Globals::fatal('cannot write data file');
		}

		// Για λόγους ασφαλείας ονομάζουμε τα αρχεία με επίθεμα ".php"
		// και γράφουμε στην πρώτη γραμμή ένα πολύ απλό πρόγραμμα με
		// το οποίο εκτυπώνεται σελίδα oops σε περίπτωση που κάποιος
		// επιχειρεί να προβάλλει ή να κατεβάσει το περιεχόμενο.
		Globals::put_line($fh, '<?php header("Location: ' . $globals->server .
			'lib/oops.php"); die("Oops!"); ?>');

		Partida::grapse($fh, $this->partida);
		Dianomi::grapse($fh, $this->dianomi);
		Kinisi::grapse($fh, $this->kinisi);
		Prosklisi::grapse($fh, $this->prosklisi);
		Sxesi::grapse($fh, $this->sxesi);
		Permes::grapse($fh, $this->permes);
		Kafenio::grapse($fh, $this->trapezi);
		Rebelos::grapse($fh, $this->rebelos);
		Sizitisi::grapse($fh, $this->sizitisi, 'SIZITISI');
		Sizitisi::grapse($fh, $this->kafenio, 'KAFENIO');
		$procstat->grapse($fh);

		fclose($fh);
		$globals->xeklidoma($globals->pektis->login);
	}

	private static function open_file($rw) {
		global $globals;

		$fname = "../dedomena/" . $globals->pektis->login . ".php";
		$fh = @fopen($fname, $rw);
		return($fh);
	}
}

function torina_dedomena($prev = NULL) {
	global $globals;
	global $sinedria;

	$dedomena = new Dedomena();

	$dedomena->partida = Partida::process();

	$dedomena->dianomi = Dianomi::process();
	$globals->dianomi = $dedomena->dianomi;

	$dedomena->kinisi = Kinisi::process();
	$globals->kinisi = $dedomena->kinisi;

	if (($prev == NULL) || $globals->pektis->prosklidirty) {
		$dedomena->prosklisi = Prosklisi::process();
	}
	else {
		$dedomena->prosklisi = $prev->prosklisi;
	}

	if (($prev == NULL) || $globals->pektis->minimadirty) {
		$dedomena->permes = Permes::process();
	}
	else {
		$dedomena->permes = $prev->permes;
	}

	if (($prev == NULL) || $globals->pektis->sxesidirty) {
		$dedomena->sxesi = Sxesi::process();
		$sxesi_same = FALSE;
	}
	else {
		$dedomena->sxesi = $prev->sxesi;
		$sxesi_same = TRUE;
	}

	if ($prev == NULL) {
		$dedomena->trapezi = Kafenio::process();
		$dedomena->rebelos = Rebelos::process();
		$dedomena->trapezi_checked = TRUE;
	}
	elseif ($sinedria->trapezidirty != 0) {
		$dedomena->trapezi = Kafenio::process();
		$dedomena->rebelos = Rebelos::process();
		$dedomena->trapezi_checked = TRUE;
		$sinedria->clear_trapezidirty($sinedria->trapezidirty);
	}
	else {
		$dedomena->trapezi = $prev->trapezi;
		$dedomena->rebelos = $prev->rebelos;
		$dedomena->trapezi_checked = FALSE;
	}

	if ($prev == NULL) {
		$dedomena->sizitisi = Sizitisi::process_sizitisi();
		$dedomena->kafenio = Sizitisi::process_kafenio();
	}
	elseif ($sinedria->sizitisidirty > 0) {
		$dedomena->sizitisi = Sizitisi::process_sizitisi();
		$dedomena->kafenio = Sizitisi::process_kafenio();
		$sinedria->clear_sizitisidirty();
	}
	elseif (($dedomena->partida != NULL) && (($prev->partida == NULL) ||
		($dedomena->partida->kodikos != $prev->partida->kodikos))) {
		$dedomena->sizitisi = Sizitisi::process_sizitisi();
		$dedomena->kafenio = $prev->kafenio;
	}
	else {
		$dedomena->sizitisi = $prev->sizitisi;
		$dedomena->kafenio = $prev->kafenio;
	}

	// Αν δεν έχουν ελεγχθεί οι σχέσεις θα πρέπει να ελεγχθούν τώρα,
	// εφόσον έχει αλλάξει κάτι που αφορά στους παίκτες.

	if ($sxesi_same && (($dedomena->trapezi != $prev->trapezi) ||
		($dedomena->rebelos != $prev->rebelos))) {
		$dedomena->sxesi = Sxesi::process();
	}

	return($dedomena);
}

function freska_dedomena($dedomena) {
	$dedomena->grapse();
	print_epikefalida();
	print ",f:1}";

	Partida::print_json_data($dedomena->partida);
	Dianomi::print_json_data($dedomena->dianomi);
	Kinisi::print_json_data($dedomena->kinisi);
	Prosklisi::print_json_data($dedomena->prosklisi);
	Sxesi::print_json_data($dedomena->sxesi);
	Permes::print_json_data($dedomena->permes);
	Kafenio::print_json_data($dedomena->trapezi);
	Rebelos::print_json_data($dedomena->rebelos);
	Sizitisi::sizitisi_json_data($dedomena->sizitisi);
	Sizitisi::kafenio_json_data($dedomena->kafenio);
}

function diaforetika_dedomena($curr, $prev) {
	$curr->grapse();
	print_epikefalida();
	print "}";

	Partida::print_json_data($curr->partida, $prev->partida);
	Dianomi::print_json_data($curr->dianomi, $prev->dianomi);
	Kinisi::print_json_data($curr->kinisi, $prev->kinisi);
	Prosklisi::print_json_data($curr->prosklisi, $prev->prosklisi);
	Sxesi::print_json_data($curr->sxesi, $prev->sxesi);
	Permes::print_json_data($curr->permes, $prev->permes);
	Kafenio::print_json_data($curr->trapezi, $prev->trapezi);
	Rebelos::print_json_data($curr->rebelos, $prev->rebelos);
	Sizitisi::sizitisi_json_data($curr->sizitisi, $prev->sizitisi);
	Sizitisi::kafenio_json_data($curr->kafenio, $prev->kafenio);
}

function open_monitor_file() {
	global $monitor_fh;
	$monitor_fh = NULL;
return;
	$pektis = Globals::perastike_check('login');
	if ($pektis != 'panos') {
		return;
	}

	$fname = '../dedomena/' . $pektis . ".mon";
	$monitor_fh = fopen($fname, "a");
	monitor_write("START");
}

function monitor_write($data = "") {
	global $monitor_fh;
	if (isset($monitor_fh)) {
		fwrite($monitor_fh, microtime(TRUE) . ": " . $data . "\n");
		fflush($monitor_fh);
	}
}

class Sinedria {
	public $kodikos;
	public $enimerosi;
	public $peknpat;
	public $pekstat;
	public $sizitisidirty;
	public $trapezi;
	public $trapezidirty;
	private $clear;

	public function __construct() {
		unset($this->kodikos);
		unset($this->enimerosi);
		unset($this->peknpat);
		unset($this->pekstat);
		$this->sizitisidirty = 0;
		$this->trapezi = -2;
		$this->trapezidirty = 0;
		unset($this->clear);
	}

	public function fetch() {
		global $globals;
		static $stmnt = NULL;
		$errmsg = "Sinedria::fetch(): ";

		unset($this->enimerosi);
		unset($this->peknpat);
		unset($this->pekstat);
		unset($this->sizitisidirty);
		unset($this->trapezi);
		unset($this->trapezidirty);

		if ($stmnt == NULL) {
			$query = "SELECT `enimerosi`, `peknpat`, `pekstat`, `sizitisidirty`, " .
				"`trapezi`, `trapezidirty` FROM `sinedria` WHERE `kodikos` = ?";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				$globals->klise_fige($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->bind_param("i", $this->kodikos);
		$stmnt->execute();
		$stmnt->bind_result($this->enimerosi, $peknpat, $this->pekstat,
			$this->sizitisidirty, $this->trapezi, $this->trapezidirty);
		while ($stmnt->fetch()) {
			$this->peknpat = $peknpat == '' ?
				NULL : ("%" . $globals->asfales($peknpat) . "%");
		}

		if (!isset($this->enimerosi)) {
			print_epikefalida();
			print ",fatalError: 'Ακαθόριστη συνεδρία (" . $this->kodikos .
				"). Δοκιμάστε επαναφόρτωση της σελίδας'}";
			$globals->klise_fige();
		}
	}

	public function clear_sizitisidirty() {
		global $globals;

		$query = "UPDATE `sinedria` SET `sizitisidirty` = (`sizitisidirty` - 1) " .
			" WHERE (`kodikos` = " . $this->kodikos . ") AND (`sizitisidirty` > 0)";
		@mysqli_query($globals->db, $query);
	}

	public function clear_trapezidirty($cur_dirty) {
		global $globals;

		$query = "UPDATE `sinedria` SET `trapezidirty` = " .
			($cur_dirty < 0 ? 1 : "(`trapezidirty` - 1)") .
			" WHERE (`kodikos` = " . $this->kodikos . ") AND (`trapezidirty` > 0)";
		@mysqli_query($globals->db, $query);
	}
}

class Procstat {
	public $use;
	public $total;
	public $idle;
	public $pote;
	public $load;
	public $calc;

	public function __construct() {
		$this->use = file_exists(PROCSTAT_FILE);
		$this->total = NULL;
		$this->idle = NULL;
		$this->pote = NULL;
		$this->load = NULL;
		$this->calc = FALSE;
	}

	public function diavase($fh) {
		if (!$this->use) {
			return;
		}

		$this->total = NULL;
		$this->idle = NULL;
		$this->pote = NULL;
		$this->load = NULL;
		$this->calc = FALSE;

		$line = Globals::get_line($fh);
		if (!$line) {
			return;
		}

		$cols = explode("\t", $line);
		$ncol = count($cols);
		if ($ncol < 3) {
			return;
		}

		$nf = 0;
		$this->total = $cols[$nf++];
		$this->idle = $cols[$nf++];
		$this->pote = $cols[$nf++];

		if ($ncol > 3) {
			$this->load = $cols[$nf++];
		}
	}

	public function grapse($fh) {
		if (!$this->use) {
			return;
		}

		// Για να αποφύγουμε συνεχή ανοίγματα του αρχείου κατάστασης
		// της CPU, ελέγχουμε το χρόνο προηγούμενης καταγραφής και αν
		// η καταγραφή είναι σχετικά πρόσφατη, δεν ανοίγουμε το αρχείο.
		//
		// Θυμίζουμε ότι το αρχείο είναι symbolic link του αρχείου
		// "/proc/stat" με όνομα "PROCSTAT" στο home directory της
		// εφαρμογής.

		$tora = time();
		if ($this->trexon_entaxi($fh, $tora)) {
			$this->grapse_data($fh);
			return;
		}

		$fp = @fopen(PROCSTAT_FILE, "r");
		if (!$fp) {
			$this->use = FALSE;
			return;
		}

		$tag = "";
		while ($line = Globals::get_line($fp)) {
			if (sscanf($line, "%s%d%d%d%d", $tag, $user, $nice, $system, $idle) != 5) {
				continue;
			}

			if ($tag != "cpu") {
				continue;
			}

			$total = $user + $nice + $system + $idle;
			break;
		}
		@fclose($fp);

		if ($tag != "cpu") {
			return;
		}


		$this->pote = $tora;

		// Αν δεν υπάρχει προηγούμενη καταγραφή, τότε γράφουμε για
		// πρώτη φορά τα δεδομένα στο αρχείο τελευταίας αποστολής
		// και μάλιστα καταγράφουμε μόνο τα πρωτογενή στοιχεία
		// αφήνοντας έξω το πεδίο του φόρτου (τελευταίο πεδίο).

		if (!isset($this->total)) {
			$this->total = $total;
			$this->idle = $idle;
			$this->load = NULL;
			$this->grapse_data($fh);
			return;
		}

		$total_dif = $total - $this->total;
		$idle_dif = $idle - $this->idle;

		// Πρέπει τα τωρινά στοιχεία να είναι περισσότερα από τα
		// προηγούμενα. Αν παρουσιαστεί κάποιο πρόβλημα πάνω σ' αυτό,
		// καταγράφουμε τα φρέσκα στοιχεία σαν να είναι η πρώτη φορά
		// καταγραφής.

		if ($total_dif <= 0) {
			$this->total = $total;
			$this->idle = $idle;
			$this->load = NULL;
			$this->grapse_data($fh);
			return;
		}

		// Όλα τα στοιχεία βρέθηκαν εντάξει και ήρθε η ώρα υπολογισμού
		// φόρτου. Αυτός ο νέος φόρτος θα πρέπει να αποσταλεί, επομένως
		// θέτουμε true και την αντίστοιχη flag property.

		$this->total = $total;
		$this->idle = $idle;
		$total_dif += 0.0;
		$this->load = (($total_dif - $idle_dif) / $total_dif) * 100;
		$this->calc = TRUE;
		$this->grapse_data($fh);
	}

	private function trexon_entaxi($fh, $tora) {
		// Ελέγχουμε πρώτα αν υπάρχει προηγούμενη καταγραφή.
		// Για το σκοπό αυτό ελέγχουμε το πεδίο του χρόνου.

		if (!isset($this->pote)) {
			return(FALSE);
		}

		$interval = $tora - $this->pote;

		// Αν στην προηγούμενη καταγραφή είχε υπολογιστεί φόρτος,
		// τότε ως διάστημα επανυπολογισμού χρησιμοποιείται το
		// μεγάλο (π.χ. 10 δευτερόλπετα).

		if (isset($this->load)) {
			return($interval < PROCSTAT_INTERVAL2);
		}

		// Ακόμη δεν έχει υπολογιστεί φόρτος, επομένως ως διάστημα
		// επανυπολογισμού χρησιμοποιούμε το μικρό διάστημα (π.χ.
		// 2 δευτερόλεπτα), ώστε να έχουμε σχετικά σύντομα τα πρώτα
		// στοιχεία φόρτου.

		return($interval < PROCSTAT_INTERVAL1);
	}

	private function grapse_data($fh) {
		Globals::put_line($fh, "@PROCSTAT@");
		$data = $this->total . "\t" . $this->idle . "\t" . $this->pote;
		if (isset($this->load)) {
			$data .= "\t" . $this->load;
		}

		Globals::put_line($fh, $data);
	}
}

function debug_accum($s) {
	global $debug_buffer;

	$debug_buffer .= "@@" . $s . "@@";
}

?>
