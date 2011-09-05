CREATE TABLE `μήνυμα` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`αποστολέας`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Αποστολέας',
	`παραλήπτης`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Παραλήπτης',
	`δημιουργία`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`κατάσταση`	ENUM(
		'ΝΕΟ',
		'ΔΙΑΒΑΣΜΕΝΟ'
	)		NOT NULL DEFAULT 'ΝΕΟ' COMMENT 'Κατάσταση μηνύματος',
	`μήνυμα`	VARCHAR(16384) NOT NULL COMMENT 'Κείμενο μηνύματος',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`αποστολέας`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`παραλήπτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας προσωπικών μηνυμάτων'
