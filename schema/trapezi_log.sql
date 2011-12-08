CREATE TABLE `trapezi_log` (
	`kodikos`	INTEGER(10) NOT NULL COMMENT 'Primary key',
	`pektis1`	CHARACTER(32) NULL COMMENT 'Πρώτος παίκτης',
	`pektis2`	CHARACTER(32) NULL COMMENT 'Δεύτερος παίκτης',
	`pektis3`	CHARACTER(32) NULL COMMENT 'Τρίτος παίκτης',
	`kasa`		INTEGER(4) NOT NULL COMMENT 'Ποσό κάσας',
	`pasopasopaso`	ENUM(
		'NO',
		'YES'
	)		NOT NULL COMMENT 'Παίζεται το πάσο, πάσο, πάσο',
	`asoi`	ENUM(
		'YES',
		'NO'
	)		NOT NULL COMMENT 'Μετράνε οι άσοι',
	`stisimo`	TIMESTAMP NOT NULL COMMENT 'Πότε δημιουργήθηκε',
	`telos`		TIMESTAMP NOT NULL COMMENT 'Πότε τελείωσε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	KEY (
		`pektis1`
	) USING BTREE,

	KEY (
		`pektis2`
	) USING BTREE,

	KEY (
		`pektis3`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8 COMMENT='Πίνακας κρατημένων τραπεζιών'
