CREATE TABLE `συμμετοχή` (
	`τραπέζι`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`θέση`		INTEGER(1) NOT NULL COMMENT 'Θέση',
	`παίκτης`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',

	PRIMARY KEY (
		`τραπέζι`,
		`θέση`
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
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας συμμετοχών'
