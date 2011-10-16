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

DROP TRIGGER /*!50033 IF EXISTS */ `dianomi_ins`//

CREATE TRIGGER `dianomi_ins` AFTER INSERT ON `dianomi` FOR EACH ROW BEGIN
	UPDATE `trapezi` SET `pistosi` = `pistosi` +
		((NEW.`kasa1` + NEW.`kasa2` + NEW.`kasa3`) / 10)
	WHERE `kodikos` = NEW.`trapezi`;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `dianomi_upd`//

CREATE TRIGGER `dianomi_upd` AFTER UPDATE ON `dianomi` FOR EACH ROW BEGIN
	DECLARE prin INTEGER;
	DECLARE meta INTEGER;
	SET prin = (OLD.`kasa1` + OLD.`kasa2` + OLD.`kasa3`) / 10;
	SET meta = (NEW.`kasa1` + NEW.`kasa2` + NEW.`kasa3`) / 10;
	IF (NEW.`trapezi` <> OLD.`trapezi`) THEN
		UPDATE `trapezi` SET `pistosi` = `pistosi` - prin
			WHERE `kodikos` = OLD.`trapezi`;
		UPDATE `trapezi` SET `pistosi` = `pistosi` + meta
			WHERE `kodikos` = NEW.`trapezi`;
	ELSEIF (meta <> prin) THEN
		UPDATE `trapezi` SET `pistosi` = `pistosi` - prin + meta
			WHERE `kodikos` = NEW.`trapezi`;

	END IF;
END//

DROP TRIGGER /*!50033 IF EXISTS */ `dianomi_del`//

CREATE TRIGGER `dianomi_del` AFTER DELETE ON `dianomi` FOR EACH ROW BEGIN
	UPDATE `trapezi` SET `pistosi` = `pistosi` -
		((OLD.`kasa1` + OLD.`kasa2` + OLD.`kasa3`) / 10)
	WHERE `kodikos` = OLD.`trapezi`;
END//

DELIMITER ;
