CREATE TABLE `σχέση` (
	`κωδικός`	INTEGER(10) AUTO_INCREMENT NOT NULL COMMENT 'Primary key',
	`παίκτης`	CHARACTER(32) NOT NULL COMMENT 'Login name του παίκτη',
	`σχετιζόμενος`	CHARACTER(32) NOT NULL COMMENT 'Login name του σχετιζόμενου παίκτη',
	`status`	ENUM (
		'ΦΙΛΟΣ',
		'ΑΠΟΚΛΕΙΣΜΕΝΟΣ'
	)		NOT NULL COMMENT 'Είδος σχέσης',
	`δημιουργία`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία δημιουργίας',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`παίκτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`σχετιζόμενος`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	UNIQUE KEY (
		`παίκτης`,
		`σχετιζόμενος`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας σχέσεων'
