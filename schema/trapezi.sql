CREATE TABLE `trapezi` (
	`kodikos`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis1`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Πρώτος παίκτης',
	`apodoxi1`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον πρώτο παίκτη',
	`pektis2`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Δεύτερος παίκτης',
	`apodoxi2`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον δεύτερο παίκτη',
	`pektis3`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Τρίτος παίκτης',
	`apodoxi3`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον τρίτο παίκτη',
	`kasa`		INTEGER(4) NOT NULL DEFAULT 50 COMMENT 'Ποσό κάσας',
	`pasopasopaso`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Παίζεται το πάσο, πάσο, πάσο',
	`asoi`	ENUM(
		'YES',
		'NO'
	)		NOT NULL DEFAULT 'YES' COMMENT 'Μετράνε οι άσοι',
	-- Το πεδίο "ιδιωτικότητα" αφορά στην πρόσβαση των υπολοίπων παικτών στο
	-- τραπέζι. Αν το τραπέζι είναι δημόσιο, τότε οποιοσδήποτε μπορεί να εισέλθει
	-- ως θεατής στο τραπέζι, ενώ αν είναι πριβέ, τότε απαιτείται πρόσκληση.
	-- Για συμμετοχή στο παιχνίδι, ή στη συζήτηση του τραπεζιού, απαιτείται
	-- πρόσκληση είτε το τραπέζι είναι δημόσιο, είτε όχι.
	`idiotikotita`	ENUM(
		'ΔΗΜΟΣΙΟ',
		'ΠΡΙΒΕ'
	)		NOT NULL DEFAULT 'ΔΗΜΟΣΙΟ' COMMENT 'Ιδιωτικότητα τραπεζιού',
	-- Το πεδίο "πρόσβαση" αφορά στο δικαίωμα των θεατών να βλέπουν τα φύλλα
	-- των παικτών.
	`prosvasi`	ENUM(
		'ΑΝΟΙΚΤΟ',
		'ΚΛΕΙΣΤΟ'
	)		NOT NULL DEFAULT 'ΑΝΟΙΚΤΟ' COMMENT 'Θέαση παιγνιοχάρτων',
	`stisimo`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`poll`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Last poll time',
	`telos`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Πότε τελείωσε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`pektis1`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`pektis2`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`pektis3`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	KEY (
		`telos`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας τραπεζιών'
