CREATE TABLE `sxesi` (
	`kodikos`	INTEGER(10) AUTO_INCREMENT NOT NULL COMMENT 'Primary key',
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Login name του παίκτη',
	`sxetizomenos`	CHARACTER(32) NOT NULL COMMENT 'Login name του σχετιζόμενου παίκτη',
	`status`	ENUM (
		'ΦΙΛΟΣ',
		'ΑΠΟΚΛΕΙΣΜΕΝΟΣ'
	)		NOT NULL COMMENT 'Είδος σχέσης',
	`dimiourgia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία δημιουργίας',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`sxetizomenos`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	UNIQUE KEY (
		`pektis`,
		`sxetizomenos`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας σχέσεων'
