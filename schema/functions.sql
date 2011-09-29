DELIMITER //

DROP FUNCTION IF EXISTS `paleotita`//

CREATE FUNCTION `paleotita`(`ts` TIMESTAMP)
	RETURNS INT
	NO SQL
BEGIN
	RETURN (NOW() - `ts`);
END//

DELIMITER ;
