ALTER TABLE `pektis`
ADD `superuser` ENUM('NO','YES') NOT NULL DEFAULT 'NO' AFTER `egrafi`,
ADD `melos` ENUM('NO','YES') NOT NULL DEFAULT 'NO' AFTER `superuser`,
ADD `minimadirty` ENUM('NO','YES') NOT NULL DEFAULT 'NO' AFTER `melos`,
ADD `prosklidirty` ENUM('NO','YES') NOT NULL DEFAULT 'NO' AFTER `minimadirty`
