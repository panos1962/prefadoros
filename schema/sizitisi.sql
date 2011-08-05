CREATE TABLE `συζήτηση` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`παίκτης`	CHARACTER(32) NOT NULL COMMENT 'Ομιλών παίκτης',
	-- Αν ο κωδικός τραπεζιού είναι κενός, τότε πρόκειται για σχόλιο
	-- που αφορά στη συζήτηση του καφενείου.
	`τραπέζι`	INTEGER(10) NULL COMMENT 'Κωδικός τραπεζιού',
	`σχόλιο`	VARCHAR(16384) NOT NULL COMMENT 'Κείμενο σχολίου',
	`πότε`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε ειπώθηκε',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`παίκτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`τραπέζι`
	) REFERENCES `τραπέζι` (
		`κωδικός`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας συζητήσεων'
