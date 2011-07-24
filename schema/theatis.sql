CREATE TABLE `θεατής` (
	`τραπέζι`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`παίκτης`	CHARACTER(32) NULL COMMENT 'Παίκτης',
	`θέση`		INTEGER(1) NOT NULL DEFAULT 1 COMMENT 'Θέση θέασης',

	PRIMARY KEY (
		`τραπέζι`,
		`παίκτης`
	) USING BTREE,

	FOREIGN KEY (
		`τραπέζι`
	) REFERENCES `τραπέζι` (
		`κωδικός`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`παίκτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας θεατών'
