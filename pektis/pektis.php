<?php
class Pektis {
	public $login;
	public $slogin;
	public $onoma;
	public $email;
	public $kapikia;
	public $katastasi;
	public $plati;
	public $plati_filo;
	public $plati_other;
	public $poll;
	public $idle;
	public $error;

	public function __construct($login, $password = NULL) {
		global $globals;
		$errmsg = 'Pektis::construct: ';

		unset($this->login);
		unset($this->slogin);
		unset($this->onoma);
		unset($this->email);
		unset($this->kapikia);
		unset($this->katastasi);
		unset($this->plati);
		unset($this->plati_filo);
		unset($this->plati_other);
		unset($this->poll);
		unset($this->idle);
		unset($this->error);

		$query = "SELECT *, UNIX_TIMESTAMP(`poll`) AS `poll`, " .
			"(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`poll`)) AS `idle` " .
			"FROM `pektis` WHERE `login` LIKE '" . $globals->asfales($login) . "'";
		if (isset($password)) {
			$query .= " AND `password` LIKE '" . $globals->asfales($password) . "'";
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
			$this->slogin = "'" . $globals->asfales($this->login) . "'";
			$this->onoma = $row['onoma'];
			$this->email = $row['email'];
			$this->kapikia = $row['kapikia'];
			$this->katastasi = $row['katastasi'];
			$this->plati = $row['plati'];
			$this->poll = $row['poll'];
			$this->idle = (int)($row['idle']);
		}
		else {
			$this->error = (isset($password) ?
				'Δεν έχετε πρόσβαση ως παίκτης "' . $login . '"'
			:
				'Δεν βρέθηκε ο παίκτης "' . $login . '"'
			);
		}
	}

	public function poll_update($sinedria, $id) {
		global $globals;

		$query = "UPDATE `pektis` SET `poll` = NOW() WHERE `login` LIKE " .
			"'" . $this->login . "'";
		$globals->sql_query($query);

		$query = "UPDATE `sinedria` SET `enimerosi` = " . $id .
			" WHERE `kodikos` = " . $sinedria;
		$globals->sql_query($query);
	}

	public function is_online() {
		return(Prefadoros::is_online($this->idle));
	}

	public function get_plati($other = FALSE) {
		global $globals;

		if (!isset($this->plati_filo)) {
			switch ($this->plati) {
			case 'BLUE':
				$this->plati_filo = "BV";
				$this->plati_other = "RV";
				break;
			case 'RED':
				$this->plati_filo = "RV";
				$this->plati_other = "BV";
				break;
			default:
				$x = $globals->is_trapezi() ?
					($globals->trapezi->kodikos % 2) : mt_rand(0, 1);
				if ($x == 1) {
					$this->plati_filo = "BV";
					$this->plati_other = "RV";
				}
				else {
					$this->plati_filo = "RV";
					$this->plati_other = "BV";
				}
				break;
			}
		}

		return ($other ? $this->plati_other : $this->plati_filo);
	}
}
?>
