CREATE TABLE `πρόσκληση` (
	`κωδικός`	INTEGER(10) AUTO_INCREMENT NOT NULL COMMENT 'Primary key',
	`ποιος`		CHARACTER(32) NOT NULL COMMENT 'Οικοδεσπότης',
	`ποιον`		CHARACTER(32) NOT NULL COMMENT 'Προσκεκλημένος',
	`τραπέζι`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`πότε`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε έγινε',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`ποιος`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`ποιον`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`τραπέζι`
	) REFERENCES `τραπέζι` (
		`κωδικός`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	UNIQUE KEY (
		`τραπέζι`,
		`ποιος`,
		`ποιον`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας προσκλήσεων'
