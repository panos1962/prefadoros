CREATE TABLE `sinedria_log` (
	`kodikos`	INTEGER(10) NOT NULL COMMENT 'Primary key',
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`ip`		CHARACTER(32) NOT NULL DEFAULT '' COMMENT 'IP address',
	`dimiourgia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`enimerosi`	NUMERIC(10) NOT NULL DEFAULT 0 COMMENT 'Αύξων αριθμός ενημέρωσης',
	`telos`		TIMESTAMP NOT NULL COMMENT 'Πότε έκλεισε',

	PRIMARY KEY (
		`kodikos`
	) USING HASH,

	KEY (
		`ip`
	) USING BTREE,

	KEY (
		`pektis`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας ενημερώσεων'
