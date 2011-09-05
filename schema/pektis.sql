CREATE TABLE `pektis` (
	`login`		CHARACTER(32) NOT NULL COMMENT 'Login name',
	`onoma`		VARCHAR(128) NOT NULL COMMENT 'Πλήρες όνομα παίκτη',
	`email`		VARCHAR(64) NULL DEFAULT NULL COMMENT 'e-mail address',
	`kapikia`	ENUM('YES', 'NO') NOT NULL DEFAULT 'YES' COMMENT 'Προβολή καπικιών',
	`katastasi`	ENUM('AVAILABLE', 'BUSY') NOT NULL DEFAULT 'AVAILABLE' COMMENT 'Κατάσταση παίκτη',
	`plati`		ENUM('BLUE', 'RED', 'RANDOM') NOT NULL DEFAULT 'BLUE' COMMENT 'Πλάτη φύλλων',
	`poll`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Last poll time',
	-- Το password αποθηκεύεται σε SHA1 κρυπτογραφημένη μορφή.
	`password`	CHARACTER(40) NOT NULL COMMENT 'Password',
	`egrafi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία εγγραφής',
	PRIMARY KEY (
		`login`
	) USING BTREE,
	KEY (
		`onoma`
	) USING BTREE,
	KEY (
		`email`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας παικτών'
