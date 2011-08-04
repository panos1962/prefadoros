CREATE TABLE `τραπέζι` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`παίκτης1`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Πρώτος παίκτης',
	`αποδοχή1`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον πρώτο παίκτη',
	`παίκτης2`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Δεύτερος παίκτης',
	`αποδοχή2`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον δεύτερο παίκτη',
	`παίκτης3`	CHARACTER(32) NULL DEFAULT NULL COMMENT 'Τρίτος παίκτης',
	`αποδοχή3`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Αποδοχή όρων από τον τρίτο παίκτη',
	`κάσα`		INTEGER(4) NOT NULL DEFAULT 50 COMMENT 'Ποσό κάσας',
	-- Το πεδίο "ιδιωτικότητα" αφορά στην πρόσβαση των υπολοίπων παικτών στο
	-- τραπέζι. Αν το τραπέζι είναι δημόσιο, τότε οποιοσδήποτε μπορεί να εισέλθει
	-- ως θεατής στο τραπέζι, ενώ αν είναι πριβέ, τότε απαιτείται πρόσκληση.
	-- Για συμμετοχή στο παιχνίδι, ή στη συζήτηση του τραπεζιού, απαιτείται
	-- πρόσκληση είτε το τραπέζι είναι δημόσιο, είτε όχι.
	`ιδωτικότητα`	ENUM(
		'ΠΡΙΒΕ',
		'ΔΗΜΟΣΙΟ'
	)		NOT NULL DEFAULT 'ΠΡΙΒΕ' COMMENT 'Ιδιωτικότητα τραπεζιού',
	-- Το πεδίο "πρόσβαση" αφορά στο δικαίωμα των θεατών να βλέπουν τα φύλλα
	-- των παικτών.
	`πρόσβαση`	ENUM(
		'ΑΝΟΙΚΤΟ',
		'ΚΛΕΙΣΤΟ'
	)		NOT NULL DEFAULT 'ΠΡΙΒΕ' COMMENT 'Ιδιωτικότητα τραπεζιού',
	`στήσιμο`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`τέλος`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Πότε τελείωσε',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`παίκτης1`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`παίκτης2`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	FOREIGN KEY (
		`παίκτης3`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	KEY (
		`τέλος`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας τραπεζιών'
