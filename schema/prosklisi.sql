CREATE TABLE `prosklisi` (
	`kodikos`	INTEGER(10) AUTO_INCREMENT NOT NULL COMMENT 'Primary key',
	`pios`		CHARACTER(32) NOT NULL COMMENT 'Οικοδεσπότης',
	`pion`		CHARACTER(32) NOT NULL COMMENT 'Προσκεκλημένος',
	`trapezi`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε έγινε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`pios`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`pion`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`trapezi`
	) REFERENCES `trapezi` (
		`kodikos`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	UNIQUE KEY (
		`trapezi`,
		`pios`,
		`pion`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας προσκλήσεων'
