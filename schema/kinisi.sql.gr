CREATE TABLE `κίνηση` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`διανομή`	INTEGER(10) NOT NULL COMMENT 'Κωδικός διανομής',
	-- Η θέση του παίκτη που αφορά στη συγκεκριμένη κίνηση, π.χ. σε κίνηση
	-- τύπου "ΔΙΑΝΟΜΗ" είναι ο dealer, σε κίνηση τύπου "ΑΓΟΡΑ" είναι ο
	-- τζογαδόρος κλπ.
	`παίκτης`	INTEGER(1) NOT NULL COMMENT 'Παίκτης που εκτελεί την κίνηση',
	`είδος`	ENUM (
		'ΔΙΑΝΟΜΗ',
		'ΔΗΛΩΣΗ',
		'ΤΖΟΓΟΣ',
		'ΣΟΛΟ',
		'ΑΓΟΡΑ',
		'ΣΥΜΜΕΤΟΧΗ',
		'ΦΥΛΛΟ',
		'ΜΠΑΖΑ',
		'CLAIM',
		'ΠΛΗΡΩΜΗ'
	)		NOT NULL COMMENT 'Είδος κίνησης',
	-- Το πεδίο "data" περιέχει τα δεδομένα της κίνησης και έχουν συγκεκριμένο
	-- συντακτικό και περιεχόμενο, ανάλογα με το είδος της κίνησης, π.χ.
	-- σε είδος κίνησης "ΔΙΑΝΟΜΗ" είναι τα φύλλα των παικτών 1, 2 και 3 με
	-- αυτή τη σειρά και ακολουθούν τα φύλα του τζόγου.
	`data`		VARCHAR(256) NOT NULL COMMENT 'Δεδομένα κίνησης',
	`πότε`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Χρονική στιγμή',

	PRIMARY KEY (
		`κωδικός`
	) USING BTREE,

	FOREIGN KEY (
		`διανομή`
	) REFERENCES `διανομή` (
		`κωδικός`
	) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας κινήσεων'
