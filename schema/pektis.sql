CREATE TABLE `παίκτης` (
	`login`		CHARACTER(32) NOT NULL COMMENT 'Login name',
	`όνομα`		VARCHAR(128) NOT NULL COMMENT 'Πλήρες όνομα παίκτη',
	`email`		VARCHAR(64) NULL DEFAULT NULL COMMENT 'e-mail address',
	`καπίκια`	ENUM('YES', 'NO') NOT NULL DEFAULT 'YES' COMMENT 'Προβολή καπικιών',
	`poll`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Last poll time',
	-- Το password αποθηκεύεται σε SHA1 κρυπτογραφημένη μορφή.
	`password`	CHARACTER(40) NOT NULL COMMENT 'Password',
	`εγγραφή`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία εγγραφής',
	PRIMARY KEY (
		`login`
	) USING BTREE,
	KEY (
		`όνομα`
	) USING BTREE,
	KEY (
		`email`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας παικτών'
