CREATE TABLE `sizitisi` (
	`kodikos`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Ομιλών παίκτης',
	-- Αν ο κωδικός τραπεζιού είναι κενός, τότε πρόκειται για σχόλιο
	-- που αφορά στη συζήτηση του καφενείου.
	`trapezi`	INTEGER(10) NULL COMMENT 'Κωδικός τραπεζιού',
	`sxolio`	VARCHAR(16384) NOT NULL COMMENT 'Κείμενο σχολίου',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε ειπώθηκε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`trapezi`
	) REFERENCES `trapezi` (
		`kodikos`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	KEY (
		`pote`
	) USING BTREE
) ENGINE=MEMORY CHARSET=utf8 COMMENT='Πίνακας συζητήσεων'
