CREATE TABLE `minima` (
	`kodikos`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`apostoleas`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Αποστολέας',
	`paraliptis`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Παραλήπτης',
	`dimiourgia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`katastasi`	ENUM(
		'ΝΕΟ',
		'ΔΙΑΒΑΣΜΕΝΟ'
	)		NOT NULL DEFAULT 'ΝΕΟ' COMMENT 'Κατάσταση μηνύματος',
	`minima`	VARCHAR(16384) NOT NULL COMMENT 'Κείμενο μηνύματος',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`apostoleas`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`paraliptis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας προσωπικών μηνυμάτων'
