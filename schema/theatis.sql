CREATE TABLE `θεατής` (
	`παίκτης`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`τραπέζι`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`θέση`		INTEGER(1) NOT NULL DEFAULT 1 COMMENT 'Θέση θέασης',

	PRIMARY KEY (
		`παίκτης`
	) USING BTREE,

	FOREIGN KEY (
		`παίκτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`τραπέζι`
	) REFERENCES `τραπέζι` (
		`κωδικός`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας θεατών'
