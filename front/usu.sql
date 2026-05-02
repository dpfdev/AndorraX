CREATE TABLE "usuarios"(
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `activo` TINYINT(1) DEFAULT 1,
  `rol` ENUM('usuario', 'admin') DEFAULT 'usuario',
  `verificado` TINYINT(1) DEFAULT 0,
  `token_seguridad` VARCHAR(255) DEFAULT NULL,
  `token_expiracion` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;