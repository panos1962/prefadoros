CREATE TABLE `profinfo` (
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`sxoliastis`	CHARACTER(32) NOT NULL COMMENT 'Σχολιαστής',
	`kimeno`	VARCHAR(16384) NOT NULL COMMENT 'Κείμενο παρατήρησης',

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`sxoliastis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας πληροφοριών προφίλ παίκτη'
