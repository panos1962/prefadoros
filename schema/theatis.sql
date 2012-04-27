CREATE TABLE `theatis` (
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`trapezi`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`thesi`		INTEGER(1) NOT NULL DEFAULT 1 COMMENT 'Θέση θέασης',

	PRIMARY KEY (
		`pektis`
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
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας θεατών'
