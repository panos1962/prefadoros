CREATE TABLE `kinisi` (
	`kodikos`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`dianomi`	INTEGER(10) NOT NULL COMMENT 'Κωδικός διανομής',
	-- Η θέση του παίκτη που αφορά στη συγκεκριμένη κίνηση, π.χ. σε κίνηση
	-- τύπου "ΔΙΑΝΟΜΗ" είναι ο dealer, σε κίνηση τύπου "ΑΓΟΡΑ" είναι ο
	-- τζογαδόρος κλπ.
	`pektis`	INTEGER(1) NOT NULL COMMENT 'Παίκτης που εκτελεί την κίνηση',
	`idos`	ENUM (
		'ΔΙΑΝΟΜΗ',
		'ΔΗΛΩΣΗ',
		'ΤΖΟΓΟΣ',
		'ΣΟΛΟ',
		'ΑΓΟΡΑ',
		'ΣΥΜΜΕΤΟΧΗ',
		'ΦΥΛΛΟ',
		'ΜΠΑΖΑ',
		'CLAIM',
		'ΑΚΥΡΩΣΗ',
		'ΠΛΗΡΩΜΗ'
	)		NOT NULL COMMENT 'Είδος κίνησης',
	-- Το πεδίο "data" περιέχει τα δεδομένα της κίνησης και έχουν συγκεκριμένο
	-- συντακτικό και περιεχόμενο, ανάλογα με το είδος της κίνησης, π.χ.
	-- σε είδος κίνησης "ΔΙΑΝΟΜΗ" είναι τα φύλλα των παικτών 1, 2 και 3 με
	-- αυτή τη σειρά και ακολουθούν τα φύλα του τζόγου.
	`data`		VARCHAR(70) NOT NULL COMMENT 'Δεδομένα κίνησης',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Χρονική στιγμή',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	FOREIGN KEY (
		`dianomi`
	) REFERENCES `dianomi` (
		`kodikos`
	) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας κινήσεων'
