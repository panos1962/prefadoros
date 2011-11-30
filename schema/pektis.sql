CREATE TABLE `pektis` (
	`login`		CHARACTER(32) NOT NULL COMMENT 'Login name',
	`onoma`		VARCHAR(128) NOT NULL COMMENT 'Πλήρες όνομα παίκτη',
	`email`		VARCHAR(64) NULL DEFAULT NULL COMMENT 'e-mail address',
	`kapikia`	ENUM('YES', 'NO') NOT NULL DEFAULT 'YES' COMMENT 'Προβολή καπικιών',
	`katastasi`	ENUM('AVAILABLE', 'BUSY') NOT NULL DEFAULT 'AVAILABLE' COMMENT 'Κατάσταση παίκτη',
	`plati`		ENUM('BLUE', 'RED', 'RANDOM') NOT NULL DEFAULT 'BLUE' COMMENT 'Πλάτη φύλλων',
	`enalagi`	ENUM('YES', 'NO') NOT NULL DEFAULT 'YES' COMMENT 'Εναλλαγή χρωμάτων',
	`paraskinio`	VARCHAR(32) NOT NULL DEFAULT 'standard.gif' COMMENT 'Εικόνα παρασκηνίου',
	`poll`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Last poll time',
	-- Το password αποθηκεύεται σε SHA1 κρυπτογραφημένη μορφή.
	`password`	CHARACTER(40) NOT NULL COMMENT 'Password',
	`egrafi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία εγγραφής',
	`superuser`	ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Super user',
	`proxy`		ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Allow via proxy',
	`melos`		ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Μέλος στο πριβέ',
	`minimadirty`	ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Αλλαγές στα PM',
	`prosklidirty`	ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Αλλαγές στις προσκλήσεις',
	`sxesidirty`	ENUM('NO', 'YES') NOT NULL DEFAULT 'NO' COMMENT 'Αλλαγές στις σχέσεις',
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
