<?php
class Prefadoros {
	public static function set_trapezi() {
		global $globals;

		if ($globals->is_pektis()) {
			$globals->trapezi = new Trapezi($globals->pektis->login);
			if (isset($globals->trapezi->kodikos)) {
				$globals->trapezi->fetch_dianomi();
				$globals->trapezi->fetch_kinisi();
			}
			else {
				unset($globals->trapezi);
			}
		}
	}

	public static function klidose_trapezi() {
		global $globals;

		if (!$globals->is_trapezi()) {
			telos('Ακαθόριστο τραπέζι');
		}

		if (!$globals->trapezi->klidoma()) {
			telos('Τραπέζι σε ενημέρωση');
		}
	}

	public static function xeklidose_trapezi($ok) {
		global $globals;

		if ($globals->is_trapezi()) {
			$globals->trapezi->xeklidoma($ok);
		}
		else {
			@mysqli_rollback($globals->db);
		}
	}

	public static function klidose_pekti($pektis) {
		return(klidoma('pektis:' . $pektis));
	}

	public static function xeklidose_pekti($pektis, $ok) {
		xeklidoma('pektis:' . $pektis, $ok);
	}
}
?>
