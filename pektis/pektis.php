<?php
class Pektis {
	public $login;
	public $slogin;
	public $onoma;
	public $email;
	public $kapikia;
	public $katastasi;
	public $blockimage;
	public $plati;
	public $plati_filo;
	public $plati_other;
	public $enalagi;
	public $paraskinio;
	public $poll;
	public $idle;
	public $superuser;
	public $proxy;
	public $melos;
	public $minimadirty;
	public $prosklidirty;
	public $sxesidirty;
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
		unset($this->blockimage);
		unset($this->plati);
		unset($this->plati_filo);
		unset($this->plati_other);
		unset($this->enalagi);
		unset($this->paraskinio);
		unset($this->poll);
		unset($this->idle);
		unset($this->superuser);
		unset($this->proxy);
		unset($this->melos);
		unset($this->minimadirty);
		unset($this->prosklidirty);
		unset($this->sxesidirty);
		unset($this->error);

		$query = "SELECT *, UNIX_TIMESTAMP(`poll`) AS `poll` " .
			"FROM `pektis` WHERE `login` = BINARY '" . $globals->asfales($login) . "'";
		if (isset($password)) {
			$query .= " AND `password` = BINARY '" . $globals->asfales($password) . "'";
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
			$this->blockimage = ($row['blockimage'] == 'YES');
			$this->plati = $row['plati'];
			$this->enalagi = ($row['enalagi'] == 'YES');
			$this->paraskinio = $row['paraskinio'];
			$this->poll = $row['poll'];
			$this->idle = (int)(time() - $row['poll']);
			$this->superuser = ($row['superuser'] == 'YES');
			$this->proxy = ($row['proxy'] == 'YES' ? 1 : 0);
			$this->melos = ($row['melos'] == 'YES' ? 1 : 0);
			$this->minimadirty = ($row['minimadirty'] == 'YES');
			$this->prosklidirty = ($row['prosklidirty'] == 'YES');
			$this->sxesidirty = ($row['sxesidirty'] == 'YES');
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

		$now = time();

		if ((($now - $this->poll) > XRONOS_POLL_GRANULE) &&
			($this->login != SYSTEM_ACCOUNT)) {
			$now_ts = $now - ($now % XRONOS_POLL_GRANULE) + XRONOS_POLL_GRANULE;
			$query = "UPDATE `pektis` SET `poll` = FROM_UNIXTIME(" . $now_ts .
				") WHERE `login` = BINARY " . $this->slogin;
			$globals->sql_query($query);
			if ($globals->is_trapezi()) {
				if ($globals->trapezi->is_theatis()) {
					$query = "UPDATE `trapezi` SET `poll` = FROM_UNIXTIME(" . $now_ts .
						") WHERE (`telos` IS NULL) AND " . "((`pektis1` = BINARY " .
						$this->slogin . ") OR (`pektis2` = BINARY " . $this->slogin .
						") OR (`pektis3` = BINARY " . $this->slogin . "))";
				}
				else {
					$query = "UPDATE `trapezi` SET `poll` = FROM_UNIXTIME(" . $now_ts .
						") WHERE `kodikos` = " . $globals->trapezi->kodikos;
				}
				$globals->sql_query($query);
			}
		}

		$query = "UPDATE `sinedria` SET `enimerosi` = " . $id . ", `trapezi` = " .
			$sinedria->trapezi . ", `sizitisidirty` = " . $sinedria->sizitisidirty .
			" WHERE `kodikos` = " . $sinedria->kodikos;
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

	public function check_dirty() {
		global $globals;
		static $stmnt = NULL;
		$errmsg = "Pektis::check_dirty(): ";

		$this->minimadirty = FALSE;
		$this->prosklidirty = FALSE;
		$this->sxesidirty = FALSE;

		if ($stmnt == NULL) {
			$query = "SELECT `minimadirty`, `prosklidirty`, `sxesidirty` " .
				"FROM `pektis` WHERE `login` = BINARY ?";
			$stmnt = $globals->db->prepare($query);
			if (!$stmnt) {
				die($errmsg . $query . ": failed to prepare");
			}
		}

		$stmnt->bind_param("s", $this->login);
		$stmnt->execute();
		$stmnt->bind_result($minimadirty, $prosklidirty, $sxesidirty);
		while ($stmnt->fetch()) {
			$this->minimadirty = ($minimadirty == 'YES');
			$this->prosklidirty = ($prosklidirty == 'YES');
			$this->sxesidirty = ($sxesidirty == 'YES');
		}

		$query = "";
		$set_koma = "SET ";

		if ($this->minimadirty) {
			$query .= ($set_koma . "`minimadirty` = 'NO'");
			$set_koma = ", ";
		}

		if ($this->prosklidirty) {
			$query .= ($set_koma . "`prosklidirty` = 'NO'");
			$set_koma = ", ";
		}

		if ($this->sxesidirty) {
			$query .= ($set_koma . "`sxesidirty` = 'NO'");
			$set_koma = ", ";
		}

		if ($query != "") {
			$query = "UPDATE `pektis` " . $query .
				" WHERE `login` = BINARY " . $this->slogin;
			$globals->sql_query($query);
		}
	}
}
?>
