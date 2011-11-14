CREATE TABLE `simetoxi` (
	`trapezi`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`thesi`		INTEGER(1) NOT NULL COMMENT 'Θέση',
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',

	PRIMARY KEY (
		`trapezi`,
		`thesi`
	) USING BTREE,

	FOREIGN KEY (
		`trapezi`
	) REFERENCES `trapezi` (
		`kodikos`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας συμμετοχών'
