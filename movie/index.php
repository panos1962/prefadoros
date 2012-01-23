<?php
require_once '../lib/standard.php';
require_once '../prefadoros/prefadoros.php';
require_once '../pektis/pektis.php';
set_globals();
Prefadoros::pektis_check(FALSE, TRUE);
$globals->thesi = Globals::perastike('thesi') ? $_REQUEST["thesi"] : 1;
$trapezi = entopise_trapezi();
$dianomes = fetch_dianomes($trapezi);
if (count($dianomes) <= 0) {
	die("Δεν υπάρχουν διανομές");
}

$enarxi = Globals::perastike('enarxi');
if ($enarxi) {
	$dianomi = NULL;
	$trapezi->reset_ipolipo();
}
elseif (Globals::perastike('dianomi')) {
	$dianomi = entopise_dianomi($_REQUEST['dianomi'], $dianomes, $trapezi);
	$trapezi->calc_ipolipo($dianomes, $dianomi);
}
else {
	$dianomi = NULL;
	$trapezi->calc_ipolipo($dianomes);
}
$kinisi = fetch_kinisi($dianomi);
$debugger = Globals::perastike('debug');
Page::head("Πρεφαδόρος -- Παρτίδα " . $trapezi->kodikos);
Page::stylesheet('movie/movie');
Page::stylesheet('prefadoros/prefadoros');
Page::javascript('movie/movie');
Page::javascript('prefadoros/pexnidi');
Page::javascript('prefadoros/misc');
?>
<script type="text/javascript">
//<![CDATA[
if (notSet(window.Movie)) { var Movie = {}; }
Movie.thesi = <?php print $globals->thesi; ?>;
Movie.mapThesi = [0<?php
for ($i = 1; $i <= 3; $i++) {
	print "," . map_thesi($i);
}
?>];
Movie.trapezi = <?php print $trapezi->kodikos; ?>;
Movie.dianomi = <?php print isset($dianomi) ? $dianomi->kodikos : "null"; ?>;
Movie.ipolipo = <?php print $trapezi->ipolipo; ?>;
Movie.enarxi = <?php print $enarxi ? "true" : "false"; ?>;
Movie.dianomes = [];
Movie.kinisi = [];
Movie.kapikia = [];
Movie.autoplay = <?php print $globals->perastike("autoplay") ? 'true' : 'false'; ?>;
Movie.dbg = <?php print $debugger ? "true" : "false"; ?>;
pektis = {};
pektis.login = '<?php print $globals->pektis->login; ?>';
pektis.enalagi = <?php print $globals->pektis->enalagi ? 'true' : 'false'; ?>;
<?php
$n = count($dianomes);
for ($i = 0; $i < $n; $i++) {
	?>
	Movie.dianomes[<?php print $i; ?>] = <?php print $dianomes[$i]->kodikos; ?>;
	<?php
}
$n = count($kinisi);
for ($i = 0; $i < $n; $i++) {
	?>
	Movie.kinisi[<?php print $i; ?>] = <?php print $kinisi[$i]->json(); ?>;
	<?php
}
?>
Movie.kapikia[1] = <?php print $trapezi->kapikia1; ?>;
Movie.kapikia[2] = <?php print $trapezi->kapikia2; ?>;
Movie.kapikia[3] = <?php print $trapezi->kapikia3; ?>;
//]]>
</script>
<?php
Page::body();
Page::epikefalida(TRUE);
Page::fyi("margin-bottom: 0.2cm; width: 24.4cm;");
?>
<div id="main" class="movieMain">
	<div id="epikefalida" class="movieEpikefalida">
		<?php epikefalida($trapezi, $dianomi, $enarxi); ?>
	</div>
	<div id="trapezi" class="movieTrapezi">
		<?php trapezi($trapezi, $dianomi); ?>
		<?php idieterotites($trapezi); ?>
	</div>
	<div class="movieDianomes">
		<?php lista_dianomon($dianomes, $dianomi, $enarxi); ?>
	</div>
	<div class="movieControls">
		<?php controls(); ?>
	</div>
	<?php if ($debugger) { debug_area(); } ?>
</div>
<?php
Page::close(FALSE);

function epikefalida($trapezi, $dianomi, $enarxi) {
	?>
	<table width="100%" class="tbldbg">
	<tr>
	<td class="movieEpikefalidaLeft tbldbg">
	Παρτίδα <span class="partidaInfoData"><?php
		print $trapezi->kodikos; ?></span>,
		κάσα <span class="partidaInfoData"><?php
		print $trapezi->kasa; ?></span>,
		υπόλοιπο <span id="ipolipo" class="partidaInfoData"><?php
		print $trapezi->ipolipo; ?></span>
	</td>
	<td class="movieEpikefalidaRight tbldbg">
	<?php
	if (isset($dianomi)) {
		?>
		Διανομή <span class="partidaInfoData"><span id="dianomi"><?php
			print $dianomi->kodikos; ?></span></span>
		<?php
	}
	else {
		?>
		<span class="partidaInfoData">
			<?php print $enarxi ? "Έναρξη" : "Τέλος"; ?>
		</span>
		<?php
	}
	?>
	</td>
	</tr>
	</table>
	<?php
}

function trapezi($trapezi, $dianomi) {
	global $globals;
	?>
	<div style="position: relative; height: 14.0cm;">
		<div id="pektis3" class="moviePektisArea moviePektisArea3" title="Αλλαγή θέσης"
			onclick="Movie.alagiThesis(<?php print map_thesi(3); ?>);">
			<div id="pektisMain3" class="moviePektisMain moviePektisMain3">
				<div class="moviePektis moviePektis3">
					<?php
					print $trapezi->pektis3;
					print_kapikia(3, $trapezi->kapikia3);
					?>
				</div>
				<div id="filaArea3" class="movieFilaArea movieFilaArea3"></div>
				<?php check_dealer(3, $dianomi); ?>
			</div>
			<div id="dilosi3" class="movieDilosi movieDilosi3"></div>
			<div id="simetoxi3" class="movieDilosi movieSimetoxi3"></div>
		</div>
		<div id="pektis2" class="moviePektisArea moviePektisArea2" title="Αλλαγή θέσης"
			onclick="Movie.alagiThesis(<?php print map_thesi(2); ?>);">
			<div id="pektisMain2" class="moviePektisMain moviePektisMain2">
				<div class="moviePektis moviePektis2">
					<?php
					print $trapezi->pektis2;
					print_kapikia(2, $trapezi->kapikia2);
					?>
				</div>
				<div id="filaArea2" class="movieFilaArea movieFilaArea2"></div>
				<?php check_dealer(2, $dianomi); ?>
			</div>
			<div id="dilosi2" class="movieDilosi movieDilosi2"></div>
			<div id="simetoxi2" class="movieDilosi movieSimetoxi2"></div>
		</div>
		<div id="gipedo" class="movieGipedo">
			<?php tzogos($dianomi); ?>
		</div>
		<div id="pektis1" class="moviePektisArea moviePektisArea1" style="cursor: auto;">
			<div id="dilosi1" class="movieDilosi movieDilosi1"></div>
			<div id="simetoxi1" class="movieDilosi movieSimetoxi1"></div>
			<div id="filaArea1" class="movieFilaArea movieFilaArea1"></div>
			<div id="pektisMain1" class="moviePektisMain moviePektisMain1">
				<div class="moviePektis moviePektis1">
					<?php
					print $trapezi->pektis1;
					print_kapikia(1, $trapezi->kapikia1);
					?>
				</div>
				<?php check_dealer(1, $dianomi); ?>
			</div>
		</div>
		<div id="epomeno" class="movieEpomeno"></div>
		<?php mail_trapezi($trapezi, $dianomi); ?>
	</div>
	<?php
}

function tzogos($dianomi) {
	global $globals;

	if (isset($dianomi)) {
		?>
		<div id="tzogos" title="Άνοιγμα τζόγου"
			style="position: relative; cursor: pointer;"
			onclick="Movie.tzogosOnOff(this);">
		</div>
		<?php
	}
}

function check_dealer($pektis, $dianomi) {
	global $globals;

	if (!isset($dianomi)) {
		return;
	}

	$protos = $dianomi->dealer + 1;
	if ($protos > 3) {
		$protos = 1;
	}

	if ($pektis == $dianomi->dealer) {
		?>
		<img class="movieDealerIcon" src="<?php print $globals->server;
			?>images/dealer.png" title="Dealer" alt="" />
		<?php
	}
	elseif ($pektis == $protos) {
		?>
		<img class="movieDealerIcon" src="<?php print $globals->server;
			?>images/protos.png" title="Πρώτος" alt="" />
		<?php
	}
	?>
	<img id="mazi<?php print $pektis; ?>" class="movieDealerIcon" src="<?php
		print $globals->server; ?>images/mazi.png" title="Πρώτος" alt=""
		style="display: none; top: 1.8cm;" />
	<?php
}

function mail_trapezi($trapezi, $dianomi) {
	global $globals;

	$subject = "Πρεφαδόρος -- Παρτίδα " . $trapezi->kodikos;
	if (isSet($dianomi)) {
		$subject .= ", διανομή " . $dianomi->kodikos;
	}

	$body = "Ο παίκτης " . $globals->pektis->login .
		" σας έστειλε τον παρακάτω σύνδεσμο για να παρακολουθήσετε " .
		(isSet($dianomi) ? "τη διανομή " . $dianomi->kodikos . " της παρτίδας" :
		"την παρτίδα") . $trapezi->kodikos . "%0A%0A" . $globals->server .
		"movie/index.php?trapezi=" . $trapezi->kodikos;
	if (isSet($dianomi)) {
		$body .= urlencode("&dianomi=" . $dianomi->kodikos);
	}
	$body .= urlencode("&thesi=" . $globals->thesi);
	?>
	<div class="movieMail">
		<a href="mailto:?subject=<?php print $subject;
		?>&body=<?php print $body; ?>"><img src="<?php
		print $globals->server; ?>images/email.png" alt=""
		class="movieMailIcon" title="Ταχυδρομήστε αυτή <?php
		print isset($dianomi) ?  "τη διανομή" : "την παρτίδα"; ?>"
		onmouseover="this.style.width='1.4cm';"
		onmouseout="this.style.width='1.2cm';" /></a>
	</div>
	<?php
}

function entopise_trapezi() {
	global $globals;

	$t = Globals::perastike_check('trapezi');
	$query = "SELECT `kodikos`, `pektis" . map_thesi(1) . "`, `pektis" .
		map_thesi(2) . "`, `pektis" . map_thesi(3) . "`, `kasa`, " .
		"`pasopasopaso`, `asoi` FROM `trapezi_log` WHERE `kodikos` = " .
		$globals->asfales($t) . " LIMIT 1";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) {
		die($t . ": λανθασμένος κωδικός παρτίδας");
	}

	$row = @mysqli_fetch_array($result, MYSQLI_NUM);
	if (!$row) {
		die($t . ": δεν βρέθηκε το τραπέζι");
	}

	$trapezi = new Trapezi($row);
	return $trapezi;
}

function fetch_dianomes($trapezi) {
	global $globals;

	$n = 0;
	$dianomes = array();
	$query = "SELECT `kodikos`, `dealer`, `kasa" . map_thesi(1) .
		"`, `metrita" . map_thesi(1) . "`, `kasa" . map_thesi(2) .
		"`, `metrita" . map_thesi(2) . "`, `kasa" . map_thesi(3) .
		"`, `metrita" . map_thesi(3) . "` FROM `dianomi_log` " .
		"WHERE `trapezi` = " . $globals->asfales($trapezi->kodikos) .
		" ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
		$row[1] = pam_thesi($row[1]);
		$dianomes[$n] = new Dianomi($row, $trapezi);
		$n++;
	}

	return($dianomes);
}

function fetch_kinisi($dianomi) {
	global $globals;

	$kinisi = array();
	if (isset($dianomi)) {
		$n = 0;
		$query = "SELECT `kodikos`, `pektis`, `idos`, `data`, " .
			"UNIX_TIMESTAMP(`pote`) AS `pote` FROM `kinisi_log` " .
			"WHERE `dianomi` = " . $globals->asfales($dianomi->kodikos) .
			" ORDER BY `kodikos`";
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$row['pektis'] = pam_thesi($row['pektis']);
			$kinisi[$n] = new Kinisi($row);
			$n++;
		}
	}

	return($kinisi);
}

function entopise_dianomi($kodikos, $dianomes, $trapezi) {
	$n = count($dianomes);
	for ($i = 0; $i < $n; $i++) {
		if ($dianomes[$i]->kodikos == $kodikos) {
			return($dianomes[$i]);
		}
	}

	die($kodikos . ": δεν βρέθηκε διανομή στο τραπέζι " . $trapezi->kodikos);
}

function lista_dianomon($dianomes, $dianomi, $enarxi) {
	$n = count($dianomes);
	if ($n > 0) {
		?>
		<div class="movieDianomesItem movieDianomesTelos<?php
			if ((!isset($dianomi)) && $enarxi) {
				print " movieTelosSpot";
			}?>" title="Αρχική εικόνα"
			onclick="Movie.selectDianomi(0);">ΕΝΑΡΞΗ</div>
		<?php
	}
	$spot = 0;
	for ($i = 0; $i < $n; $i++) {
		if (isset($dianomi) && ($dianomes[$i]->kodikos == $dianomi->kodikos)) {
			$spot = $i;
			$spotClass = " movieDianomesSpot";
		}
		else {
			$spotClass = "";
		}
		?>
		<div id="dianomi<?php print $i; ?>" class="movieDianomesItem zebra<?php
			print ($i % 2) . $spotClass; ?>" title="Διανομή <?php
			print $dianomes[$i]->kodikos; ?>"
			onmouseover="Movie.ipopsifiaDianomi(this, true);"
			onmouseout="Movie.ipopsifiaDianomi(this, false);"
			onclick="Movie.selectDianomi(<?php print $dianomes[$i]->kodikos; ?>);">
		<?php
		$agora = explode(":", $dianomes[$i]->agora);
		if (count($agora) < 2) {
			?>
			<div style="text-align: center;">
				ΠΑΣΟ
			</div>
			<?php
		}
		else {
			?>
			<div class="movieDianomesTzogadoros movieDianomesTzogadoros<?php
				print $dianomes[$i]->tzogadoros_thesi % 3; ?>">
				<?php print $dianomes[$i]->tzogadoros; ?>
			</div>
			<div class="movieDianomesAgoraArea">
				<div class="movieDianomesSimetoxi">
					<?php print decode_simetoxi($dianomes[$i]->simetoxi); ?>
				</div>
				<div class="movieDianomesAgora">
					<?php print decode_agora($agora[0]); ?>
				</div>
			</div>
			<?php
		}
		?>
		</div>
		<?php
	}

	if ($n > 0) {
		?>
		<div class="movieDianomesItem movieDianomesTelos<?php
			if ((!isset($dianomi)) && (!$enarxi)) {
				print " movieTelosSpot";
			}?>" title="Τελική εικόνα"
			onclick="Movie.selectDianomi();">ΤΕΛΟΣ</div>
		<?php
		if ($spot > 10) {
			?>
			<script type="text/javascript">
			//<![CDATA[
			Movie.dianomiSpot = <?php print $spot - 10; ?>;
			//]]>
			</script>
			<?php
		}
	}
}

function idieterotites($trapezi) {
	global $globals;

	$idieterotites = "";

	if ($trapezi->ppp) {
		$idieterotites .= '<img class="movieIdieterotitesIcon" src="' .
			$globals->server . 'images/controlPanel/ppp.png" ' .
			'title="Παίζεται το πάσο, πάσο, πάσο" alt="" />';
	}

	if (!($trapezi->asoi)) {
		$idieterotites .= '<img class="movieIdieterotitesIcon" src="' .
			$globals->server . 'images/trapoula/asoi.png" ' .
			'title="Δεν παίζουν οι άσοι" alt="" />';
	}

	if ($idieterotites != "") {
		?>
		<div class="movieIdieterotites">
			<?php print $idieterotites; ?>
		</div>
		<?php
	}
}

function decode_agora($s) {
	global $globals;

	$asoi = preg_match("/^Y/", $s);
	$xroma = substr($s, 1, 1);
	$bazes = substr($s, 2, 1);


	$agora = ($bazes == "T" ? 10 : $bazes) .
		'<img class="movieDianomesXroma" src="' . $globals->server .
			'images/trapoula/xroma' . $xroma . '.png" alt="" />';
	if ($asoi) {
		$agora .= '<img class="movieDianomesAsoi" src="' .
			$globals->server . 'images/trapoula/asoi.png" alt="" />';
	}
	return($agora);
}

function decode_simetoxi($n) {
	global $globals;

	if ($n > 2) {
		return('<img class="movieDianomesMaziIcon" src="' .
			$globals->server . 'images/mazi.png" alt="" />');
	}

	$simetoxi = "";
	for ($i = 0; $i < $n; $i++) {
		$simetoxi .= '<img class="movieDianomesSimetoxiIcon" src="' .
			$globals->server . 'images/missingPhoto.png" alt="" />';
	}

	return($simetoxi);
}

function controls() {
	global $globals;
	?>
	<div class="movieControlsLeft">
		<img class="movieControlIcon movieTimeIcon" src="<?php print $globals->server;
			?>images/trapoula/tzogos.png" alt="" title="Εμφάνιση τζόγου"
			style="display: none;" id="tzogosDflt"
			onclick="Movie.tzogosDefaultOnOff(this);" />
		<img class="movieControlIcon movieTimeIcon" src="<?php print $globals->server;
			?>images/movie/roloi.png" alt="" title="Πραγματικός χρόνος"
			id="roloi" onclick="Movie.setRealTime(true);" />
		<img class="movieControlIcon movieTimeIcon" src="<?php print $globals->server;
			?>images/movie/metronomos.png" alt="" title="Μηχανικός χρόνος"
			id="metronomos" onclick="Movie.setRealTime(false);" />
	</div>
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/stop.png" alt="" title="Διακοπή"
		onclick="Movie.Controls.stop();" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/rev.png" alt="" title="Προηγούμενη διανομή"
		onclick="Movie.Controls.prevDianomi();" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/fwd.png" alt="" title="Επόμενη διανομή"
		onclick="Movie.Controls.nextDianomi();" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/end.png" title="Επόμενη κίνηση" alt=""
		onclick="Movie.Controls.play(1);" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/start.png" title="Προηγούμενη κίνηση" alt=""
		onclick="Movie.Controls.play(-1);" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/pause.png" alt="" title="Προσωρινή διακοπή"
		onclick="Movie.Controls.pause();" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/play.png" alt="" title="Αναπαραγωγή κινήσεων"
		onclick="Movie.Controls.play();" />
	<div class="movieControlsRight">
		<img id="playing" class="movieControlIcon" src="<?php print $globals->server;
			?>images/rollStar.gif" alt="" title="Playing…"
			style="display: none;" />
		<img class="movieControlIcon movieTimeIcon" src="<?php print $globals->server;
			?>images/movie/xelonaki.png" alt="" title="Επιβράδυνση"
			id="slow" onclick="Movie.slower();" />
		<img class="movieControlIcon movieTimeIcon" src="<?php print $globals->server;
			?>images/movie/piravlos.png" alt="" title="Επιτάχυνση"
			id="fast" onclick="Movie.faster();" />
	</div>
	<?php
}

function print_kapikia($thesi, $x) {
	if ($x < 0) {
		$class = "kapikiaMion";
		$prosimo = "";
		$kapikia = $x;
		$left = "0.2cm";
	}
	elseif ($x > 0) {
		$class = "kapikiaSin";
		$prosimo = "+";
		$kapikia = $x;
		$left = "0.2cm";
	}
	else {
		$class = "";
		$prosimo = "";
		$kapikia = "";
		$left = "0px";
	}
	?><span id="kapikia<?php print $thesi; ?>" class="<?php
		print $class; ?>" style="padding-left: <?php
		print $left; ?>"><?php print $prosimo . $kapikia;
		?></span><?php
}

function map_thesi($thesi) {
	global $globals;

	switch ($globals->thesi) {
	case 2:
		$map = array(0, 2, 3, 1);
		break;
	case 3:
		$map = array(0, 3, 1, 2);
		break;
	default:
		$map = array(0, 1, 2, 3);
		break;
	}

	return($map[$thesi]);
}

function pam_thesi($thesi) {
	global $globals;

	switch ($globals->thesi) {
	case 2:
		$pam = array(0, 3, 1, 2);
		break;
	case 3:
		$pam = array(0, 2, 3, 1);
		break;
	default:
		$pam = array(0, 1, 2, 3);
		break;
	}

	return($pam[$thesi]);
}

function debug_area() {
	?>
	<div id="debugArea" class="movieDebugArea">
		<span style="text-decoration: underline;">
			Welcome to the movie debugger!
		</span>
	</div>
	<?php
}

class Trapezi {
	public $kodikos;
	public $pektis1;
	public $pektis2;
	public $pektis3;
	public $kasa;
	public $ppp;
	public $asoi;
	public $ipolipo;
	public $kapikia1;
	public $kapikia2;
	public $kapikia3;

	public function __construct($row) {
		$n = 0;
		$this->kodikos = $row[$n++];
		$this->pektis1 = $row[$n++];
		$this->pektis2 = $row[$n++];
		$this->pektis3 = $row[$n++];
		$this->kasa = $row[$n++];
		$this->ppp = ($row[$n++] == 'YES');
		$this->asoi = ($row[$n++] == 'YES');
		$this->ipolipo = $this->kasa * 30;
		$this->kapikia1 = -$this->kasa * 10;
		$this->kapikia2 = -$this->kasa * 10;
		$this->kapikia3 = -$this->kasa * 10;
	}

	public function reset_ipolipo() {
		$this->kapikia1 = 0;
		$this->kapikia2 = 0;
		$this->kapikia3 = 0;
		$this->ipolipo /= 10;
	}

	public function calc_ipolipo($dianomes, $dianomi = NULL) {
		$n = count($dianomes);
		for ($i = 0; $i < $n; $i++) {
			if (isset($dianomi) && ($dianomes[$i]->kodikos == $dianomi->kodikos)) {
				break;
			}

			$this->kapikia1 += $dianomes[$i]->kasa1 + $dianomes[$i]->metrita1;
			$this->ipolipo -= $dianomes[$i]->kasa1;
			$this->kapikia2 += $dianomes[$i]->kasa2 + $dianomes[$i]->metrita2;
			$this->ipolipo -= $dianomes[$i]->kasa2;
			$this->kapikia3 += $dianomes[$i]->kasa3 + $dianomes[$i]->metrita3;
			$this->ipolipo -= $dianomes[$i]->kasa3;
		}

		$triadi = round($this->ipolipo / 3.0);
		$this->kapikia1 += $triadi;
		$this->kapikia2 += $triadi;
		$this->kapikia3 = -$this->kapikia1 - $this->kapikia2;
		$this->ipolipo /= 10;
	}
}

class Dianomi {
	public $kodikos;
	public $dealer;
	public $kasa1;
	public $metrita1;
	public $kasa2;
	public $metrita2;
	public $kasa3;
	public $metrita3;
	public $tzogadoros_thesi;
	public $tzogadoros;
	public $agora;
	public $simetoxi;

	public function __construct($row, $trapezi) {
		$n = 0;
		$this->kodikos = $row[$n++];
		$this->dealer = $row[$n++];
		$this->kasa1 = $row[$n++];
		$this->metrita1 = $row[$n++];
		$this->kasa2 = $row[$n++];
		$this->metrita2 = $row[$n++];
		$this->kasa3 = $row[$n++];
		$this->metrita3 = $row[$n++];
		$this->set_agora($trapezi);
	}

	private function set_agora($trapezi) {
		global $globals;

		$this->simetoxi = 0;
		$query = "SELECT `pektis`, `idos`, `data` FROM `kinisi_log` WHERE `dianomi` = " .
			$this->kodikos . " AND `idos` IN ('ΑΓΟΡΑ', 'ΣΥΜΜΕΤΟΧΗ')";
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
			$row[0] = pam_thesi($row[0]);
			switch ($row[1]) {
			case 'ΑΓΟΡΑ':
				switch ($row[0]) {
				case 1:
				case 2:
				case 3:
					$this->tzogadoros_thesi = $row[0];
					$pektis = "pektis" . $row[0];
					$this->tzogadoros = $trapezi->$pektis;
					$this->agora = $row[2];
					break;
				default:
					$this->tzogadoros = NULL;
					$this->agora = NULL;
					break;
				}
				break;
			case 'ΣΥΜΜΕΤΟΧΗ':
				switch ($row[2]) {
				case 'ΠΑΙΖΩ':
					$this->simetoxi++;
					break;
				case 'ΜΑΖΙ':
					$this->simetoxi = 3;
					break;
				}
				break;
			}
		}
	}
}

class Kinisi {
	public $kodikos;
	public $pektis;
	public $idos;
	public $data;

	public function __construct($row) {
		$this->kodikos = $row['kodikos'];
		$this->pektis = $row['pektis'];
		$this->idos = $row['idos'];
		$this->data = $row['data'];
		$this->pote = $row['pote'];
	}

	public function json() {
		print "{kodikos:" . $this->kodikos . ",pektis:'" . $this->pektis .
			"',idos:'" . $this->idos . "',data:'" . $this->data .
			"',pote:" . $this->pote . "}";
	}
}

?>
