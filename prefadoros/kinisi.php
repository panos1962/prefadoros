<?php
class Kinisi {
	public static function insert($dianomi, $pektis, $idos, $data) {
		global $globals;

		self::check_data($idos, $data);

		$query = "INSERT INTO `κίνηση` (`διανομή`, `παίκτης`, `είδος`, `data`) VALUES (" .
			$dianomi . ", " . $pektis . ", '" . $idos . "', '" . $data . "')";
		$globals->sql_query($query);
		if (@mysqli_affected_rows($globals->db) != 1) {
			die("Απέτυχε η εισαγωγή κίνησης (" . $query . ")");
		}
		return @mysqli_insert_id($globals->db);
	}

	public static function check_data($idos, $data) {
		return;
	}
}
