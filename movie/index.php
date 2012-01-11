<?php
require_once '../lib/standard.php';
set_globals();
$trapezi = entopise_trapezi();
$dianomes = fetch_dianomes($trapezi);
if (count($dianomes) <= 0) {
	die("Δεν υπάρχουν διανομές");
}

if (Globals::perastike('dianomi')) {
	$dianomi = entopise_dianomi($_REQUEST['dianomi'], $dianomes, $trapezi);
}
else {
	$dianomi = NULL;
}
$trapezi->calc_ipolipo($dianomes, $dianomi);
$kinises = fetch_kinises($dianomi);
Page::head("Πρεφαδόρος -- Παρτίδα " . $trapezi->kodikos);
Page::stylesheet('prefadoros/prefadoros');
Page::stylesheet('movie/movie');
Page::javascript('movie/movie');
?>
<script type="text/javascript">
//<![CDATA[
if (notSet(window.Movie)) { Movie = {}; }
Movie.trapezi = <?php print $trapezi->kodikos; ?>;
Movie.kinises = [];
<?php
$n = count($kinises);
for ($i = 0; $i < $n; $i++) {
	?>
	Movie.kinises[<?php print $i; ?>] = <?php print $kinises[$i]->json(); ?>;
	<?php
}
?>
//]]>
</script>
<?php
Page::body();
?>
<div id="main" class="movieMain">
	<div id="epikefalida" class="movieEpikefalida">
		<table width="100%" class="tbldbg">
		<tr>
		<td class="movieEpikefalidaLeft tbldbg">
		Παρτίδα <span class="partidaInfoData"><?php
			print $trapezi->kodikos; ?></span>,
			κάσα <span class="partidaInfoData"><?php
			print $trapezi->kasa; ?></span>,
			υπόλοιπο <span class="partidaInfoData"><?php
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
		?>
		</td>
		</tr>
		</table>
	</div>
	<div id="trapezi" class="movieTrapezi">
		<div style="position: relative; height: 14.0cm;">
			<div id="pektis3" class="moviePektisArea moviePektisArea3">
				<div class="moviePektisMain moviePektisMain3">
					<div class="moviePektis moviePektis3">
						<?php
						print $trapezi->pektis3;
						print_kapikia($trapezi->kapikia3);
						?>
					</div>
					<?php check_dealer(3, $dianomi); ?>
				</div>
			</div>
			<div id="pektis2" class="moviePektisArea moviePektisArea2">
				<div class="moviePektisMain moviePektisMain2">
					<div class="moviePektis moviePektis2">
						<?php
						print $trapezi->pektis2;
						print_kapikia($trapezi->kapikia2);
						?>
					</div>
					<?php check_dealer(2, $dianomi); ?>
				</div>
			</div>
			<div id="pektis1" class="moviePektisArea moviePektisArea1">
				<div class="moviePektisMain moviePektisMain1">
					<div class="moviePektis moviePektis1">
						<?php
						print $trapezi->pektis1;
						print_kapikia($trapezi->kapikia1);
						?>
					</div>
					<?php check_dealer(1, $dianomi); ?>
				</div>
			</div>
		</div>
		<?php idieterotites($trapezi); ?>
	</div>
	<div class="movieDianomes">
		<?php lista_dianomon($dianomes, $dianomi); ?>
	</div>
	<div class="movieControls">
		<?php controls(); ?>
	</div>
</div>
<?php
Page::close(FALSE);

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
}

function entopise_trapezi() {
	global $globals;

	$t = Globals::perastike_check('trapezi');
	$query = "SELECT `kodikos`, `pektis1`, `pektis2`, `pektis3`, `kasa`, " .
		"`pasopasopaso`, `asoi` FROM `trapezi_log` WHERE `kodikos` = " .
		$globals->asfales($t) . " LIMIT 1";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) {
		die($t . ": λανθασμένος κωδικός παρτίδας");
	}

	$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
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
	$query = "SELECT `kodikos`, `dealer`, `kasa1`, `metrita1`, " .
		"`kasa2`, `metrita2`, `kasa3`, `metrita3` FROM `dianomi_log` " .
		"WHERE `trapezi` = " . $globals->asfales($trapezi->kodikos) .
		" ORDER BY `kodikos`";
	$result = $globals->sql_query($query);
	while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$dianomes[$n] = new Dianomi($row, $trapezi);
		$n++;
	}

	return($dianomes);
}

function fetch_kinises($dianomi) {
	global $globals;

	$kinises = array();
	if (isset($dianomi)) {
		$n = 0;
		$query = "SELECT `kodikos`, `pektis`, `idos`, `data`, " .
			"UNIX_TIMESTAMP(`pote`) AS `pote` FROM `kinisi_log` " .
			"WHERE `dianomi` = " . $globals->asfales($dianomi->kodikos) .
			" ORDER BY `kodikos`";
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$kinises[$n] = new Kinisi($row);
			$n++;
		}
	}

	return($kinises);
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

function lista_dianomon($dianomes, $dianomi) {
	$n = count($dianomes);
	if ($n > 0) {
		?>
		<div class="movieDianomesItem movieDianomesTelos" title="Τελική εικόνα"
			onclick="Movie.selectDianomi();">Έναρξη</div>
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
			onmouseover="this.style.fontWeight='bold';"
			onmouseout="this.style.fontWeight='normal';"
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
			<div class="movieDianomesSimetoxi">
				<?php print decode_simetoxi($dianomes[$i]->simetoxi); ?>
			</div>
			<div class="movieDianomesAgora">
				<?php print decode_agora($agora[0]); ?>
			</div>
			<?php
		}
		?>
		</div>
		<?php
	}

	if ($n > 0) {
		?>
		<div class="movieDianomesItem movieDianomesTelos" title="Τελική εικόνα"
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

	if ($trapezi->asoi) {
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
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/stop.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/pause.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/play.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/start.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/end.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/rev.png" alt="" />
	<img class="movieControlIcon" src="<?php print $globals->server;
		?>images/movie/fwd.png" alt="" />
	<?php
}

function print_kapikia($x) {
	if ($x > 0) {
		?>&nbsp;<span class="kapikiaSin">+<?php print $x; ?></span><?php
	}
	elseif ($x < 0) {
		?>&nbsp;<span class="kapikiaMion"><?php print $x; ?></span><?php
	}
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
		$this->kodikos = $row['kodikos'];
		$this->pektis1 = $row['pektis1'];
		$this->pektis2 = $row['pektis2'];
		$this->pektis3 = $row['pektis3'];
		$this->kasa = $row['kasa'];
		$this->ppp = $row['pasopasopaso'] == 'YES';
		$this->asoi = $row['asoi'] == 'YES';
		$this->ipolipo = $this->kasa * 30;
		$this->kapikia1 = -$this->kasa * 10;
		$this->kapikia2 = -$this->kasa * 10;
		$this->kapikia3 = -$this->kasa * 10;
	}

	public function calc_ipolipo($dianomes, $dianomi) {
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
		$this->kodikos = $row['kodikos'];
		$this->dealer = $row['dealer'];
		$this->kasa1 = $row['kasa1'];
		$this->metrita1 = $row['metrita1'];
		$this->kasa2 = $row['kasa2'];
		$this->metrita2 = $row['metrita2'];
		$this->kasa3 = $row['kasa3'];
		$this->metrita3 = $row['metrita3'];
		$this->set_agora($trapezi);
	}

	private function set_agora($trapezi) {
		global $globals;

		$this->simetoxi = 0;
		$query = "SELECT `pektis`, `idos`, `data` FROM `kinisi_log` WHERE `dianomi` = " .
			$this->kodikos . " AND `idos` IN ('ΑΓΟΡΑ', 'ΣΥΜΜΕΤΟΧΗ')";
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_NUM)) {
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
