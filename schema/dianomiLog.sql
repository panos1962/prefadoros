CREATE TABLE `dianomiLog` (
	`kodikos`	INTEGER(10) NOT NULL COMMENT 'Primary key',
	`trapezi`	INTEGER(10) NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`dealer`	INTEGER(1) NOT NULL COMMENT 'Ποιος μοιράζει',
	`kasa1`		INTEGER(3) NOT NULL COMMENT 'Καπίκια κάσας πρώτου παίκτη',
	`metrita1`	INTEGER(3) NOT NULL COMMENT 'Καπίκια μετρητά πρώτου παίκτη',
	`kasa2`		INTEGER(3) NOT NULL COMMENT 'Καπίκια κάσας δεύτερου παίκτη',
	`metrita2`	INTEGER(3) NOT NULL COMMENT 'Καπίκια μετρητά δεύτερου παίκτη',
	`kasa3`		INTEGER(3) NOT NULL COMMENT 'Καπίκια κάσας τρίτου παίκτη',
	`metrita3`	INTEGER(3) NOT NULL COMMENT 'Καπίκια μετρητά τρίτου παίκτη',
	`enarxi`	TIMESTAMP NOT NULL COMMENT 'Μοίρασμα διανομής',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`trapezi`
	) REFERENCES `trapezi` (
		`kodikos`
	) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας κρατημένων διανομών'
