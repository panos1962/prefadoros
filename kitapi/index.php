<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/dianomi.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::set_pektis();
Prefadoros::set_trapezi();
$globals->trapezi->fetch_dianomi();
global $id;
global $hpektis;

$id = 0;
$height = Globals::perastike('height')? $_REQUEST['height'] : 600;
$fsize = (int)($height / 35);
$hpektis = (int)($height / 2.2);
$wkapikia = (int)($height / 16);

Page::head();
Page::javascript('kitapi/kitapi');
?>
<style type="text/css">
body {
	background-image: none;
	background-image: url(../images/kitapi.jpg);
	background-repeat: repeat;
	font-size: <?php print $fsize; ?>px;
/*
	background-color: #FFFFC8;
*/
	margin: 0px;
	font-family: "Comic Sans MS", cursive;
}

.kapikia {
	font-style: italic;
	font-size: 90%;
	color: #191970;
/*
	background-color: #FFFFD6;
*/
	width: <?php print $wkapikia; ?>px;
	text-align: right;
	padding-right: <?php print $fsize; ?>px;
}

.diagrafi {
	text-decoration:line-through;
	color: #6B7A8A;
}

.kapikiaIpolipo {
	font-weight: bold;
}

.kitapi {
	border-style: solid;
	border-width: 2px;
	border-color: #333333;
	border-collapse: collapse;
	vertical-align: top;
}

.kitapi3 {
	border-style: none solid none none;
	width: 50%;
}

.kitapi2 {
	border-style: none;
	width: 50%;
}

.kitapi1 {
	border-style: solid none none none;
}

.pektisNameArea {
	text-align: center;
	margin-top: <?php print (int)($fsize * 0.2); ?>px;
	margin-bottom: 0.2cm;
}

.pektisName {
	display: inline-block;
	width: 0px;
	max-width: 0px;
	overflow: hidden;

	opacity: 0.5;
	filter: alpha(opacity=50);
}

.pektisNameData {
	font-weight: bold;
	font-size: <?php print (int)($fsize * 1.2); ?>px;
	color: #003366;
	background-color: #FFFF66;
	border-style: solid;
	border-width: 1px;
	border-color: #C2C2C2;
	padding-left: 2px;
	padding-right: 2px;
}

.kasa {
	font-size: <?php print $fsize; ?>px;
	font-weight: bold;
	color: #191970;
	text-align: center;
}
</style>
</head>
<body id="selida">
	<?php
	if ($globals->is_trapezi()) {
		kitapi();
	}
	?>
</body>
</html>
<?php
$globals->klise_fige();

function kitapi() {
	global $globals;
	fix_arnitika();
	?>
	<table width="100%" style="border-spacing: 0px;">
	<tr>
		<td class="kitapi kitapi3">
			<?php print_pektis($globals->trapezi->pektis3, 3, 'bottom', 'top'); ?>
		</td>
		<td class="kitapi kitapi2">
			<?php print_pektis($globals->trapezi->pektis2, 2, 'top', 'bottom'); ?>
		</td>
	</tr>
	<tr>
		<td class="kitapi kitapi1" colspan="3">
			<?php print_pektis($globals->trapezi->pektis1, 1); ?>
		</td>
	</tr>
	</table>
	<?php
}

function fix_arnitika() {
	global $globals;

	$kasa1 = $globals->trapezi->kasa;
	$kasa2 = $globals->trapezi->kasa;
	$kasa3 = $globals->trapezi->kasa;

	$n = count($globals->dianomi);
	for ($i = 0; $i < $n; $i++) {
		$kasa1 -= ($globals->dianomi[$i]->kasa1 / 10);
		$kasa2 -= ($globals->dianomi[$i]->kasa2 / 10);
		$kasa3 -= ($globals->dianomi[$i]->kasa3 / 10);
		if (($kasa1 >= 0) && ($kasa2 >= 0) && ($kasa3 >= 0)) {
			continue;
		}

		$kialo = TRUE;
		while (($kasa1 < 0) && $kialo) {
			$kialo = FALSE;
			while (($kasa1 < 0) && ($kasa2 >= $kasa3) && ($kasa2 > 0)) {
				$kasa1++;
				$globals->dianomi[$i]->kasa1 -= 10;
				$kasa2--;
				$globals->dianomi[$i]->kasa2 += 10;
				$globals->dianomi[$i]->metrita1 += 10;
				$globals->dianomi[$i]->metrita2 -= 10;
				$kialo = TRUE;
			}
			while (($kasa1 < 0) && ($kasa3 >= $kasa2) && ($kasa3 > 0)) {
				$kasa1++;
				$globals->dianomi[$i]->kasa1 -= 10;
				$kasa3--;
				$globals->dianomi[$i]->kasa3 += 10;
				$globals->dianomi[$i]->metrita1 += 10;
				$globals->dianomi[$i]->metrita3 -= 10;
				$kialo = TRUE;
			}
		}

		$kialo = TRUE;
		while (($kasa2 < 0) && $kialo) {
			$kialo = FALSE;
			while (($kasa2 < 0) && ($kasa1 >= $kasa3) && ($kasa1 > 0)) {
				$kasa2++;
				$globals->dianomi[$i]->kasa2 -= 10;
				$kasa1--;
				$globals->dianomi[$i]->kasa1 += 10;
				$globals->dianomi[$i]->metrita2 += 10;
				$globals->dianomi[$i]->metrita1 -= 10;
				$kialo = TRUE;
			}
			while (($kasa2 < 0) && ($kasa3 >= $kasa1) && ($kasa3 > 0)) {
				$kasa2++;
				$globals->dianomi[$i]->kasa2 -= 10;
				$kasa3--;
				$globals->dianomi[$i]->kasa3 += 10;
				$globals->dianomi[$i]->metrita2 += 10;
				$globals->dianomi[$i]->metrita3 -= 10;
				$kialo = TRUE;
			}
		}

		$kialo = TRUE;
		while (($kasa3 < 0) && $kialo) {
			$kialo = FALSE;
			while (($kasa3 < 0) && ($kasa1 >= $kasa2) && ($kasa1 > 0)) {
				$kasa3++;
				$globals->dianomi[$i]->kasa3 -= 10;
				$kasa1--;
				$globals->dianomi[$i]->kasa1 += 10;
				$globals->dianomi[$i]->metrita3 += 10;
				$globals->dianomi[$i]->metrita1 -= 10;
				$kialo = TRUE;
			}
			while (($kasa3 < 0) && ($kasa2 >= $kasa1) && ($kasa2 > 0)) {
				$kasa3++;
				$globals->dianomi[$i]->kasa3 -= 10;
				$kasa2--;
				$globals->dianomi[$i]->kasa2 += 10;
				$globals->dianomi[$i]->metrita3 += 10;
				$globals->dianomi[$i]->metrita2 -= 10;
				$kialo = TRUE;
			}
		}
	}
}

function print_pektis($onoma, $pektis, $btl = 'top', $btr = 'top') {
	global $hpektis;
	global $id;
	?>
	<table class="tbldbg" width="100%">
		<td id="ks<?php print $id++; ?>" class="kapikia tbldbg"
			style="vertical-align: <?php print $btl; ?>;">
			<?php
			switch ($pektis) {
			case 3:
				print_kapikia31();
				break;
			case 2:
				print_kapikia23();
				break;
			case 1:
				print_kapikia13();
				break;
			}
			?>
		</td>
		<td id="ks<?php print $id++; ?>" class="tbldbg"
			style="vertical-align: top; height: <?php print $hpektis; ?>px;">
			<div id="na<?php print $pektis; ?>" class="pektisNameArea">
				<div id="n<?php print $pektis; ?>" class="pektisName">
					<span class="pektisNameData"><?php print $onoma; ?></span>
				</div>
			</div>
			<div class="kasa">
				<?php print_kasa($pektis); ?>
			</div>
		</td>
		<td id="ks<?php print $id++; ?>" class="kapikia tbldbg"
			style="vertical-align: <?php print $btr; ?>;">
			<?php
			switch ($pektis) {
			case 3:
				print_kapikia32();
				break;
			case 2:
				print_kapikia21();
				break;
			case 1:
				print_kapikia12();
				break;
			}
			?>
		</td>
	</table>
	<?php
}

function print_kasa($pektis) {
	global $globals;

	$klist = Array();
	$n = 0;
	$klist[$n++] = $globals->trapezi->kasa;

	$m = count($globals->dianomi);
	for ($i = 0; $i < $m; $i++) {
		switch ($pektis) {
		case 1:
			if ($globals->dianomi[$i]->kasa1 != 0) {
				$klist[$n] = $klist[$n - 1] - ($globals->dianomi[$i]->kasa1 / 10);
				$n++;
			}
			break;
		case 2:
			if ($globals->dianomi[$i]->kasa2 != 0) {
				$klist[$n] = $klist[$n - 1] - ($globals->dianomi[$i]->kasa2 / 10);
				$n++;
			}
			break;
		case 3:
			if ($globals->dianomi[$i]->kasa3 != 0) {
				$klist[$n] = $klist[$n - 1] - ($globals->dianomi[$i]->kasa3 / 10);
				$n++;
			}
			break;
		}
	}

	$n--;
	for ($i = 0; $i < $n; $i++) {
		if ($klist[$i] != 0) {
			print '<div class="diagrafi">' . $klist[$i] . '</div>';
		}
	}

	if ($klist[$n] > 0) {
		print '<div>' . $klist[$n] . '</div>';
	}
	elseif ($klist[$n] < 0) {
		print '<div style="color: #990000;">' . $klist[$n] . '</div>';
	}
	else if ($klist[$n] == 0) {
		print '<div style="color: #990000;">0</div>';
	}
}

function print_kapikia31() {
	kapikia_lista(3, 1, TRUE);
}

function print_kapikia32() {
	kapikia_lista(3, 2);
}

function print_kapikia23() {
	kapikia_lista(2, 3);
}

function print_kapikia21() {
	kapikia_lista(2, 1, TRUE);
}

function print_kapikia13() {
	kapikia_lista(1, 3);
}

function print_kapikia12() {
	kapikia_lista(1, 2);
}

function pare_dose($n, $pare, $dose) {
	global $globals;

	if (($pare == 1) && ($dose == 2)) {
		$k_pare = $globals->dianomi[$n]->metrita1;
		$k_dose = $globals->dianomi[$n]->metrita2;
		$k_alos = $globals->dianomi[$n]->metrita3;
	}
	elseif (($pare == 1) && ($dose == 3)) {
		$k_pare = $globals->dianomi[$n]->metrita1;
		$k_dose = $globals->dianomi[$n]->metrita3;
		$k_alos = $globals->dianomi[$n]->metrita2;
	}
	elseif (($pare == 2) && ($dose == 1)) {
		$k_pare = $globals->dianomi[$n]->metrita2;
		$k_dose = $globals->dianomi[$n]->metrita1;
		$k_alos = $globals->dianomi[$n]->metrita3;
	}
	elseif (($pare == 2) && ($dose == 3)) {
		$k_pare = $globals->dianomi[$n]->metrita2;
		$k_dose = $globals->dianomi[$n]->metrita3;
		$k_alos = $globals->dianomi[$n]->metrita1;
	}
	elseif (($pare == 3) && ($dose == 1)) {
		$k_pare = $globals->dianomi[$n]->metrita3;
		$k_dose = $globals->dianomi[$n]->metrita1;
		$k_alos = $globals->dianomi[$n]->metrita2;
	}
	elseif (($pare == 3) && ($dose == 2)) {
		$k_pare = $globals->dianomi[$n]->metrita3;
		$k_dose = $globals->dianomi[$n]->metrita2;
		$k_alos = $globals->dianomi[$n]->metrita1;
	}

	if (($k_pare == 0) || ($k_dose == 0)) {
		return(0);
	}

	if (($k_pare > 0) && ($k_dose > 0)) {
		return(0);
	}

	if (($k_pare < 0) && ($k_dose < 0)) {
		return(0);
	}

	if (($k_pare + $k_dose) == 0) {
		return($k_pare);
	}

	if (($k_alos == 0) || (($k_pare > 0) && ($k_alos > 0)) ||
		(($k_pare < 0) && ($k_alos < 0))) {
		return($k_pare);
	}

	return($k_pare + $k_alos);
}

function kapikia_lista($pare, $dose, $anapoda = FALSE) {
	global $globals;

	$klist = Array();
	$k = 0;
	$total = 0;
	$n = count($globals->dianomi);
	for ($i = 0; $i < $n; $i++) {
		$p = pare_dose($i, $pare, $dose);
		if ($p != 0) {
			$total += $p;
			if ($total > 0) {
				$klist[$k++] = $total;
			}
		}
	}

	if ($k-- <= 0) {
		return;
	}

	if ($klist[$k] == $total) {
		$dlast = 'kapikiaIpolipo';
	}
	else {
		$dlast = 'diagrafi';
	}

	if ($anapoda) {
		print '<div class="' . $dlast . '">' . $klist[$k] . '</div>';
		while (--$k >= 0) {
			print '<div class="diagrafi">' . $klist[$k] . '</div>';
		}
	}
	else {
		for ($i = 0; $i < $k; $i++) {
			print '<div class="diagrafi">' . $klist[$i] . '</div>';
		}
		print '<div class="' . $dlast . '">' . $klist[$k] . '</div>';
	}
}

?>
