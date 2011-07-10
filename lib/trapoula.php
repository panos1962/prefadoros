<?php

class Trapoula {
	public $fila;

	public function __construct() {
		$xroma = array('S', 'C', 'D', 'H');
		$axia = array('7', '8', '9', 'T', 'J', 'Q', 'K', 'A');
		$this->fila = array();
		foreach ($xroma as $x) {
			foreach ($axia as $a) {
				$this->fila[] = $x . $a;
			}
		}
	}

	public function anakatema() {
		for ($i = 0; $i < 1000; $i++) {
			$k = mt_rand(0, 31);
			$l = mt_rand(0, 31);
			if ($l != $k) {
				$t = $this->fila[$l];
				$this->fila[$l] = $this->fila[$k];
				$this->fila[$k] = $t;
			}
		}
	}

	public function parousiasi() {
		?>
		<div style="margin-top: 1.0cm;">
		</div>
		<div class="trapoulaParousiasi">
			<?php self::dixe_ikona('tzogos', 'width: 1.8cm;'); ?>
			<?php self::dixe_ikona('asoi'); ?>
			<?php self::dixe_ikona('xromaS'); ?>
			<?php self::dixe_ikona('xromaC'); ?>
			<?php self::dixe_ikona('xromaD'); ?>
			<?php self::dixe_ikona('xromaH'); ?>
		</div>
		<div style="margin-top: 1.0cm;">
		</div>
		<?php
		for ($i = 0; $i < 4; $i++) {
			?>
			<div class="trapoulaParousiasi">
			<?php
			for ($j = 0; $j < 8; $j++) {
				self::dixe_ikona($this->fila[($i * 8) + $j]);
			}
			?>
			</div>
			<?php
		}
	}

	public static function dixe_ikona($img, $style = NULL) {
		global $globals;
		?>
		<img class="trapoulaFilo" <?php
			if (isset($style)) {
				?>
				style="<?php print $style; ?>"
				<?php
			}
			?>
			src="<?php print $globals->server; ?>images/trapoula/<?php
			print $img; ?>.png" alt="" />
		<?php
	}
}

function dianomi($dealer = NULL) {
	global $globals;

	$trapoula = new Trapoula;
	$trapoula->anakatema();

	if (!isset($dealer)) {
		$dealer = mt_rand(1, 3);
	}

	$query = "INSERT INTO `διανομή` (`τραπέζι`, `dealer`) VALUES " .
		"(" . $globals->trapezi->kodikos . ", " . $dealer . ")";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) {
		return FALSE;
	}

	$dianomi = @mysqli_insert_id($globals->db);
	$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) " .
		"VALUES (" . $dianomi . ", " . $dealer . ", 'ΔΙΑΝΟΜΗ', '";
	for ($i = 0; $i < 32; $i++) {
		$query .= $trapoula->fila[$i];
	}
	$query .= "')";
	$result = @mysqli_query($globals->db, $query);
	if (!$result) {
		return FALSE;
	}

	return(TRUE);
}
