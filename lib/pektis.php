<?php
class Pektis {
	public $login;
	public $onoma;
	public $email;
	public $kapikia;
	public $katastasi;
	public $idle;
	public $error;

	public function __construct($login, $password = NULL) {
		global $globals;
		$errmsg = 'Pektis::construct: ';

		unset($this->login);
		unset($this->onoma);
		unset($this->email);
		unset($this->kapikia);
		unset($this->katastasi);
		unset($this->idle);
		unset($this->error);

		$query = "SELECT `login`, `όνομα`, `email`, `καπίκια`, " .
			"κατάσταση, (NOW() - `poll`) AS `idle` " .
			"FROM `παίκτης` WHERE `login` LIKE '" . Globals::asfales($login) . "'";
		if (isset($password)) {
			$query .= " AND `password` LIKE '" . Globals::asfales($password) . "'";
		}

		$result = @mysqli_query($globals->db, $query);
		if (!$result) {
			$this->error = $errmsg . @mysqli_error($globals->db);
			return;
		}

		$row = @mysqli_fetch_array($result, MYSQLI_ASSOC);
		if ($row) {
			@mysqli_free_result($result);
			$this->login = $row['login'];
			$this->onoma = $row['όνομα'];
			$this->email = $row['email'];
			$this->kapikia = $row['καπίκια'];
			$this->katastasi = $row['κατάσταση'];
			$this->idle = (int)($row['idle']);
		}
		else {
			if (isset($password)) {
				$this->error = 'Δεν έχετε πρόσβαση ως παίκτης "' . $login . '"';
			}
			else {
				$this->error = 'Δεν βρέθηκε ο παίκτης "' . $login . '"';
			}
		}
	}
}
?>
