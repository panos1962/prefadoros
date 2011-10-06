DELIMITER //

DROP TRIGGER /*!50033 IF EXISTS */ `minima_ins`//

CREATE TRIGGER `minima_ins` AFTER INSERT ON `minima` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `minimadirty` = 'YES' WHERE `login` LIKE NEW.`paraliptis`;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `minima_upd`//

CREATE TRIGGER `minima_upd` AFTER UPDATE ON `minima` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `minimadirty` = 'YES' WHERE `login` LIKE NEW.`paraliptis`;
	IF NEW.`paraliptis` <> OLD.`paraliptis` THEN
		UPDATE `pektis` SET `minimadirty` = 'YES' WHERE `login` LIKE OLD.`paraliptis`;
	END IF;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `minima_del`//

CREATE TRIGGER `minima_del` AFTER DELETE ON `minima` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `minimadirty` = 'YES' WHERE `login` LIKE OLD.`paraliptis`;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `proskli_ins`//

CREATE TRIGGER `proskli_ins` AFTER INSERT ON `prosklisi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `prosklidirty` = 'YES'
	WHERE (`login` LIKE NEW.`pios`) OR (`login` LIKE NEW.`pion`);
END//

DROP TRIGGER /*!50033 IF EXISTS */ `proskli_upd`//

CREATE TRIGGER `proskli_upd` AFTER UPDATE ON `prosklisi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `prosklidirty` = 'YES'
	WHERE (`login` LIKE NEW.`pios`) OR (`login` LIKE NEW.`pion`);
	IF NEW.`pios` <> OLD.`pios` THEN
		UPDATE `pektis` SET `prosklidirty` = 'YES'
		WHERE `login` LIKE OLD.`pios`;
	END IF;
	IF NEW.`pion` <> OLD.`pion` THEN
		UPDATE `pektis` SET `prosklidirty` = 'YES'
		WHERE `login` LIKE OLD.`pion`;
	END IF;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `proskli_del`//

CREATE TRIGGER `proskli_del` AFTER DELETE ON `prosklisi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `prosklidirty` = 'YES'
	WHERE (`login` LIKE OLD.`pios`) OR (`login` LIKE OLD.`pion`);
END//

DROP TRIGGER /*!50033 IF EXISTS */ `sxesi_ins`//

CREATE TRIGGER `sxesi_ins` AFTER INSERT ON `sxesi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `sxesidirty` = 'YES'
	WHERE (`login` LIKE NEW.`pektis`) OR (`login` LIKE NEW.`sxetizomenos`);
END//

DROP TRIGGER /*!50033 IF EXISTS */ `sxesi_upd`//

CREATE TRIGGER `sxesi_upd` AFTER UPDATE ON `sxesi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `sxesidirty` = 'YES'
	WHERE (`login` LIKE NEW.`pektis`) OR (`login` LIKE NEW.`sxetizomenos`);
	IF NEW.`pektis` <> OLD.`pektis` THEN
		UPDATE `pektis` SET `sxesidirty` = 'YES'
		WHERE `login` LIKE OLD.`pektis`;
	END IF;
	IF NEW.`sxetizomenos` <> OLD.`sxetizomenos` THEN
		UPDATE `pektis` SET `sxesidirty` = 'YES'
		WHERE `login` LIKE OLD.`sxetizomenos`;
	END IF;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `sxesi_del`//

CREATE TRIGGER `sxesi_del` AFTER DELETE ON `sxesi` FOR EACH ROW BEGIN
	UPDATE `pektis` SET `sxesidirty` = 'YES'
	WHERE (`login` LIKE OLD.`pektis`) OR (`login` LIKE OLD.`sxetizomenos`);
END//

DELIMITER ;
