<?php
function process_trapezi() {
	global $globals;

	$energos = Prefadoros::energos_pektis();
	$trapezi = array();

	klise_palia_trapezia();
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

function klise_palia_trapezia() {
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
?>
