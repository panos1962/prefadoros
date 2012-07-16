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
	`pistosi`	INTEGER(4) NOT NULL DEFAULT 0 COMMENT 'Αναληφθέντα ποσά',
	`idioktisia`	ENUM(
		'ΕΛΕΥΘΕΡΟ',
		'ΙΔΙΟΚΤΗΤΟ'
	)		NOT NULL DEFAULT 'ΕΛΕΥΘΕΡΟ' COMMENT 'Ιδιοκτησιακό καθεστώς',
	`efe`	CHARACTER(32) NOT NULL DEFAULT '' COMMENT 'Εφέ εικόνας κλπ',
	`pasopasopaso`	ENUM(
		'NO',
		'YES'
	)		NOT NULL DEFAULT 'NO' COMMENT 'Παίζεται το πάσο, πάσο, πάσο',
	`asoi`	ENUM(
		'YES',
		'NO'
	)		NOT NULL DEFAULT 'YES' COMMENT 'Μετράνε οι άσοι',
	-- Το πεδίο "postel" δείχνει πώς θα πληρωθεί η τελευταία αγορά της παρτίδας.
	-- Υπάρχουν τρεις τρόποι πληρωμής:
	--
	-- Κανονικός (συμβολίζεται με το αχλάδι)
	-- -------------------------------------
	-- Η τελευταία αγορά πληρώνεται με αξία προσαρμοσμένη στο υπόλοιπο της κάσας.
	-- Αν, π.χ. υπάρχουν 20 καπίκια στην κάσα και γίνει αγορά στις απλές κούπες,
	-- τότε η αξία των μπαζών δεν λογίζεται προς 5 καπίκια/μπάζα, αλλά προς
	-- 2 καπίκια/μπάζα. Αυτός είναι ο ενδεδειγμένος τρόπος πληρωμής.
	--
	-- Ανισόρροπος (συμβολίζεται με την πιπεριά)
	-- -----------------------------------------
	-- Η τελευταία αγορά πληρώνεται με αξία προσαρμοσμένη στο υπόλοιπο της κάσας,
	-- εκτός και αν η αγορά μπει μέσα είτε από τον τζογαδόρο είτε από τους αμυνόμενους.
	-- Αν, λοιπόν, η αγορά μπει μέσα, τότε η πληρωμή γίνεται με βάση την πραγματική
	-- αξία της αγοράς. Ο τρόπος αυτός είναι ανισόρροπος, καθώς το διακύβευμα
	-- μπορεί να είναι μικρό, ενώ το ρίσκο μεγάλο.
	--
	-- Δίκαιος (συμβολίζεται με την ντομάτα)
	-- -------------------------------------
	-- Η τελευταία αγορά πληρώνεται με την πραγματική αξία της αγοράς είτε επαρκεί
	-- το υπόλοιπο της κάσας, είτε όχι. Σε περίπτωση που δεν επαρκεί το υπόλοιπο
	-- της κάσας, παρουσιάζεται αρνητικό υπόλοιπο κάσας και είναι σαν να προστέθηκε
	-- λίγη επιπλέον κάσα από όλους τους παίκτες ώστε να επαρκεί για την πληρωμή.
	-- Ο τρόπος αυτός είναι πατέντα του «Πρεφαδόρου» και δεν διαφοροποιεί καθόλου
	-- την τελευταία αγορά από τις προηγούμενες αγορές.
	`postel`	ENUM(
		'ΚΑΝΟΝΙΚΗ',
		'ΑΝΙΣΟΡΡΟΠΗ',
		'ΔΙΚΑΙΗ'
	)		NOT NULL DEFAULT 'ΚΑΝΟΝΙΚΗ' COMMENT 'Πληρωμή τελευταίας αγοράς',
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
