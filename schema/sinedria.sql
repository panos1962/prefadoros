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
	`sizitisidirty`	ENUM('YES', 'NO') NOT NULL DEFAULT 'YES' COMMENT 'Αλλαγές στη συζήτηση',

	PRIMARY KEY (
		`kodikos`
	) USING HASH,

	FOREIGN KEY (
		`pektis`
	) REFERENCES `pektis` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας ενημερώσεων'
