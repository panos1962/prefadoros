<?php
class Prefadoros {
	public static $errmsg = 'Prefadoros::';

	public static function set_pektis($login = FALSE) {
		global $globals;

		if ($globals->is_pektis()) {
			Globals::fatal(self::$errmsg . 'set_pektis(): επανακαθορισμός παίκτη');
		}

		if ($login) {
			$globals->pektis = new Pektis($login);
			if (!isset($globals->pektis->login)) {
				unset($globals->pektis);
			}
		}
		elseif (Session::is_set('ps_login')) {
			$globals->pektis = new Pektis($_SESSION['ps_login']);
			if (!isset($globals->pektis->login)) {
				unset($_SESSION['ps_login']);
				unset($globals->pektis);
			}
		}
	}

	public static function pektis_check($login = FALSE) {
		global $globals;

		if (!$globals->is_pektis()) {
			self::set_pektis($login);
			if (!$globals->is_pektis()) {
				Globals::fatal(self::$errmsg . 'pektis_check(): ακαθόριστος παίκτης');
			}
		}
	}

	public static function set_trapezi() {
		global $globals;

		if ($globals->is_trapezi()) {
			Globals::fatal(self::$errmsg . 'set_trapezi(): επανακαθορισμός τραπεζιού');
		}

		if (!$globals->is_pektis()) {
			return;
		}

		$globals->trapezi = new Trapezi();
		if (!isset($globals->trapezi->kodikos)) {
			unset($globals->trapezi);
			return;
		}

		$globals->trapezi->fetch_dianomi();
		$globals->trapezi->fetch_kinisi();
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

	public static function set_params() {
		?>
		<script type="text/javascript">
			var xronos = {
				dedomena: {
					max:		<?php print XRONOS_DEDOMENA_MAX; ?>,
					tic:		<?php print XRONOS_DEDOMENA_TIC; ?>,
					namax:		<?php print XRONOS_NO_ANSWER_MAX; ?>
				}
			};
		</script>
		<?php
	}

	public static function is_online($idle) {
		return($idle < XRONOS_PEKTIS_IDLE_MAX);
	}
}
?>
