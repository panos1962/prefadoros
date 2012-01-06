CREATE TABLE `pliromi` (
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`imerominia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία πληρωμής',
	`poso`		INTEGER(6) NOT NULL DEFAULT 0 COMMENT 'Ποσό σε λεπτά',
	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,
	KEY (
		`imerominia`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας πληρωμών'
