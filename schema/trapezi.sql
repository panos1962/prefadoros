CREATE TABLE `τραπέζι` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`παίκτης1`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Πρώτος παίκτης',
	`αποδοχή1`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον πρώτο παίκτη',
	`poll1`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Τελευταία επαφή πρώτου παίκτη',
	`παίκτης2`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Δεύτερος παίκτης',
	`αποδοχή2`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον δεύτερο παίκτη',
	`poll2`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Τελευταία επαφή δεύτερου παίκτη',
	`παίκτης3`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Τρίτος παίκτης',
	`αποδοχή3`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον τρίτο παίκτη',
	`poll3`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Τελευταία επαφή τρίτου παίκτη',
	`κάσα`		INTEGER(2) NOT NULL DEFAULT 50 COMMENT 'Ποσό κάσας',
	`στήσιμο`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`τέλος`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Πότε τελείωσε',

	PRIMARY KEY (
		`κωδικός`
	) USING HASH,

	FOREIGN KEY (
		`παίκτης1`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE,

	FOREIGN KEY (
		`παίκτης2`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE,

	FOREIGN KEY (
		`παίκτης3`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE,

	KEY (
		`τέλος`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας τραπεζιών'
