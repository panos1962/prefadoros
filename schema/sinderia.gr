-- Κάθε φορά που κάποιος παίκτης επισκέπτεται το καφενείο, δημιουργείται μια
-- νέα εγγραφή συνεδρίας. Σε αυτή την εγγραφή καταγράφονται κυρίως τα κριτήρια
-- αναζήτησης παικτών.

CREATE TABLE `συνεδρία` (
	`κωδικός`	INTEGER(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`παίκτης`	CHARACTER(32) NOT NULL COMMENT 'Παίκτης',
	`δημιουργία`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`ενημέρωση`	NUMERIC(10) NOT NULL DEFAULT 0 COMMENT 'Αύξων αριθμός ενημέρωσης',
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

	PRIMARY KEY (
		`κωδικός`
	) USING HASH,

	FOREIGN KEY (
		`παίκτης`
	) REFERENCES `παίκτης` (
		`login`
	) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB CHARSET=utf8 COMMENT='Πίνακας ενημερώσεων'
