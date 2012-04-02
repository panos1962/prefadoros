-- Κάθε φορά που κάποιος παίκτης επισκέπτεται το καφενείο, δημιουργείται μια
-- νέα εγγραφή συνεδρίας. Σε αυτή την εγγραφή καταγράφονται κυρίως τα κριτήρια
-- αναζήτησης παικτών.

CREATE TABLE `sinedria` (
	`kodikos`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`ip`		CHARACTER(32) NOT NULL DEFAULT '' COMMENT 'IP address',
	`dimiourgia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`enimerosi`	NUMERIC(10) NOT NULL DEFAULT 0 COMMENT 'Αύξων αριθμός ενημέρωσης',
	`peknpat`	VARCHAR(128) NOT NULL DEFAULT '' COMMENT 'Pattern αναζήτησης παικτών',
	`peksxet`	ENUM(
		'ΟΛΟΙ',
		'ΣΧΕΤΙΖΟΜΕΝΟΙ'
	)		NOT NULL DEFAULT 'ΣΧΕΤΙΖΟΜΕΝΟΙ' COMMENT 'Αναζητούμενοι παίκτες',
	`pekstat`	ENUM(
		'ΟΛΟΙ',
		'ONLINE',
		'ΔΙΑΘΕΣΙΜΟΙ'
	)		NOT NULL DEFAULT 'ΟΛΟΙ' COMMENT 'Επιθυμητή κατάσταση παικτών',
	-- Το επόμενο πεδίο δείχνει αν η τρέχουσα συνεδρία θα επισκεφθεί για έλεγχο
	-- τον πίνακα συζήτησης. Αν είναι μεγελύτερο του μηδενός θα επισκεφθεί τον
	-- πίνακα, και θα το μειώσει κατά ένα. Με τις αλλαγές στον πίνακα συζήτησης
	-- τίθεται στην τιμή 2, επομένως θα έχουμε δύο περάσματα μέχρι να καθαρίσει.
	`sizitisidirty`	TINYINT NOT NULL DEFAULT 1 COMMENT 'Αλλαγές στη συζήτηση',
	-- Το πεδίο `trapezi` δείχνει τον κωδικό τραπεζιού το οποίο βλέπει ο παίκτης.
	-- Αν βρίσκεται στο χώρο του καφενείου, τότε τίθεται μηδέν. Το πεδίο δεν είναι
	-- σημαντικό και χρησιμοποιείται μόνο για τη συζήτηση.
	`trapezi`	NUMERIC(10) NOT NULL DEFAULT 0 COMMENT 'Τρέχον τραπέζι άποψης του παίκτη',
	`trapezidirty`	TINYINT NOT NULL DEFAULT 2 COMMENT 'Αλλαγές καφενείου',

	PRIMARY KEY (
		`kodikos`
	) USING HASH,

	KEY (
		`ip`
	) USING HASH,

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE,

	KEY (
		`trapezi`
	) USING BTREE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας ενημερώσεων'
