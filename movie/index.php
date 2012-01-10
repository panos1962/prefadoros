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
	$dianomi = $dianomes[0];
}
Page::head("Πρεφαδόρος -- Παρτίδα " . $trapezi->kodikos);
Page::stylesheet('movie/movie');
Page::javascript('movie/movie');
Page::body();
?>
<div id="main" class="movieMain">
	<div id="epikefalida" class="movieEpikefalida">
		<table width="100%" class="tbldbg">
		<tr>
		<td class="movieEpikefalidaLeft tbldbg">
		Παρτίδα <?php print $trapezi->kodikos; ?>, κάσα 50
		</td>
		<td class="movieEpikefalidaRight tbldbg">
		Διανομή <span id="dianomi"><?php print $dianomi->kodikos; ?></span>
		</td>
		</tr>
		</table>
	</div>
	<div id="trapezi" class="movieTrapezi">
		<div style="position: relative; height: 14.0cm;">
			<div class="moviePektisArea moviePektisArea3">
				3
			</div>
			<div class="moviePektisArea moviePektisArea2">
				2
			</div>
			<div class="moviePektisArea moviePektisArea1">
				1
			</div>
		</div>
	</div>
	<div class="movieDianomes">
		<?php lista_dianomon($dianomes); ?>
	</div>
	<div class="movieControls">
		Controls
	</div>
</div>
<?php
Page::close(FALSE);

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
		$dianomes[$n++] = new Dianomi($row, $trapezi);
	}

	return($dianomes);
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

function lista_dianomon($dianomes) {
	$n = count($dianomes);
	for ($i = 0; $i < $n; $i++) {
		?>
		<div class="movieDianomesItem zebra<?php print $i % 2; ?>"
			title="Διανομή <?php print $dianomes[$i]->kodikos; ?>"
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

class Trapezi {
	public $kodikos;
	public $pektis1;
	public $pektis2;
	public $pektis3;
	public $kasa;
	public $ppp;
	public $asoi;

	public function __construct($row) {
		$this->kodikos = $row['kodikos'];
		$this->pektis1 = $row['pektis1'];
		$this->pektis2 = $row['pektis2'];
		$this->pektis3 = $row['pektis3'];
		$this->kasa = $row['kasa'];
		$this->ppp = $row['pasopasopaso'] == 'YES';
		$this->asoi = $row['asoi'] == 'YES';
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
				if (!$row) {
					$this->tzogadoros = NULL;
					$this->agora = NULL;
				}
				else {
					$this->tzogadoros_thesi = $row[0];
					$pektis = "pektis" . $row[0];
					$this->tzogadoros = $trapezi->$pektis;
					$this->tzogadoros = $trapezi->$pektis;
					$this->agora = $row[2];
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

?>
