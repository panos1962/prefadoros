<?php
class Kafenio {
	public static function diavase($fh, &$tlist) {
		while ($line = Globals::get_line_end($fh)) {
			$t = new Trapezi(FALSE);
			if ($t->set_from_file($line)) {
				$tlist[] = $t;
			}
		}
	}

	public static function grapse($fh, &$tlist) {
		Globals::put_line($fh, "@TRAPEZI@");
		$n = count($tlist);
		for ($i = 0; $i < $n; $i++) {
			$tlist[$i]->print_raw_data($fh, FALSE);
		}
		Globals::put_line($fh, "@END@");
	}

	public static function print_json_data($curr, $prev = FALSE) {
		if ($prev === FALSE) {
			self::print_all_json_data($curr);
			return;
		}

		if ($curr == $prev) {
			return;
		}

		// Κατασκευάζω τα arrays "cdata" και "pdata" που περιέχουν τα
		// δεδομένα των τραπεζιών δεικτοδοτημένα με τους κωδικούς των
		// τραπεζιών.

		$cdata = array();
		$ncurr = count($curr);
		for ($i = 0; $i < $ncurr; $i++) {
			$cdata['t' . $curr[$i]->kodikos] = &$curr[$i];
		}

		$pdata = array();
		$nprev = count($prev);
		for ($i = 0; $i < $nprev; $i++) {
			$pdata['t' . $prev[$i]->kodikos] = &$prev[$i];
		}

		// Διατρέχω τώρα παλαιά και νέα δεδομένα με σκοπό να ελέγξω
		// τις διαφορές και να τις καταχωρήσω στα arrays "new", "mod"
		// και "del".

		$ndif = 0;
		$new = array();
		$mod = array();
		foreach($cdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $pdata)) {
				$new[] = &$cdata[$kodikos];
				$ndif++;
			}
			elseif ($cdata[$kodikos] != $pdata[$kodikos]) {
				$mod[$kodikos] = &$cdata[$kodikos];
				$ndif++;
			}
		}

		$del = array();
		foreach($pdata as $kodikos => $data) {
			if (!array_key_exists($kodikos, $cdata)) {
				$del[$kodikos] = TRUE;
				$ndif++;
			}
		}

		// Αν οι διαφορές που προέκυψαν μεταξύ παλαιών και νέων δεδομένων
		// είναι περισσότερες από τα ίδια τα δεδομένα, τότε επιστρέφω όλα
		// τα δεδομένα.

		if ($ndif >= $ncurr) {
			self::print_all_json_data($curr);
			return;
		}

		if (($n = count($del)) > 0) {
			print ",trapeziDel:{";
			$koma = '';
			foreach ($del as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':1";
			}
			print "}";
		}

		if (($n = count($mod)) > 0) {
			print ",trapeziMod:{";
			$koma = '';
			foreach ($mod as $i => $dummy) {
				print $koma; $koma = ",";
				print "'" . $i . "':";
				$mod[$i]->json_data();
			}
			print "}";
		}

		if (($n = count($new)) > 0) {
			print ",trapeziNew:[";
			$koma = '';
			for ($i = 0; $i < $n; $i++) {
				print $koma; $koma = ",";
				$new[$i]->json_data();
			}
			print "]";
		}
	}

	private static function print_all_json_data(&$tlist) {
		print ",trapezi:[";
		$koma = '';
		$n = count($tlist);
		for ($i = 0; $i < $n; $i++) {
			print $koma; $koma = ",";
			$tlist[$i]->json_data();
		}
		print "]";
	}

	public static function process() {
		global $globals;

		$energos = Prefadoros::energos_pektis();
		$trapezi = array();

		self::klise_palia_trapezia();
		$slogin = "'" . $globals->asfales($globals->pektis->login) . "'";
		$query = "SELECT * FROM `τραπέζι` WHERE (`τέλος` IS NULL) " .
			"ORDER BY `κωδικός` DESC"; 
		$result = $globals->sql_query($query);
		while ($row = @mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$t = new Trapezi(FALSE);
			$t->set_from_dbrow($row);
			$t->set_energos_pektis($energos);
			$trapezi[] = $t;
		}

		return($trapezi);
	}

	private static function klise_palia_trapezia() {
		global $globals;

		@mysqli_autocommit($globals->db, FALSE);
		$query = "UPDATE `τραπέζι` SET `τέλος` = NOW() " .
			"WHERE (`παίκτης1` IS NULL) AND (`παίκτης2` IS NULL) AND " .
			"(`παίκτης3` IS NULL) AND (`τέλος` IS NULL) AND " .
			"(`στήσιμο` < DATE_SUB(NOW(), INTERVAL 30 MINUTE))";
		$result = mysqli_query($globals->db, $query);
		if (!$result) {
			@mysqli_rollback($globals->db);
			return;
		}

		$query = "DELETE FROM `πρόσκληση` WHERE `τραπέζι` IN " .
			"(SELECT `κωδικός` FROM `τραπέζι` WHERE `τέλος` IS NOT NULL)";
		$result = mysqli_query($globals->db, $query);
		if (!$result) {
			@mysqli_rollback($globals->db);
			return;
		}

		$query = "DELETE FROM `θεατής` WHERE `τραπέζι` IN " .
			"(SELECT `κωδικός` FROM `τραπέζι` WHERE `τέλος` IS NOT NULL)";
		$result = mysqli_query($globals->db, $query);
		if (!$result) {
			@mysqli_rollback($globals->db);
			return;
		}
		@mysqli_commit($globals->db);
		@mysqli_autocommit($globals->db, TRUE);
	}
}
?>
