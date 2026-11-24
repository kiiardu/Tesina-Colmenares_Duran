-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-09-2026 a las 05:17:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dandelion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `especialidad` varchar(80) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `nombre`, `especialidad`, `usuario`, `password`) VALUES
(1, 'Vero y Aide', 'Peluquería', 'veroyaide', 'Veroyaidepeluqueria'),
(2, 'Micaela', 'Manicuría', 'micaela', 'Micaelauñas'),
(3, 'Iara', 'Dermatología', 'iara', 'Iaradermatologia'),
(4, 'Martina', 'Lashista', 'martinalash', 'Martinapestañas'),
(5, 'Martina', 'Maquillaje', 'martinamaq', 'Martinamaquillaje');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `duracion` int(11) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `nombre`, `duracion`, `precio`) VALUES
(1, 'Corte de cabello', 60, 8000.00),
(2, 'Semipermanente', 90, 6500.00),
(3, 'Extensión de pestañas', 120, 12000.00),
(4, 'Mechas', 120, 65000.00),
(5, 'Balayage', 150, 75000.00),
(6, 'Iluminación', 120, 60000.00),
(7, 'Color en crecimiento', 60, 30000.00),
(8, 'Corte', 45, 15000.00),
(9, 'Tratamiento Restructure', 60, 30000.00),
(10, 'Ampollas', 30, 15000.00),
(11, 'Peinado semirecogido', 45, 25000.00),
(12, 'Peinado recogido', 60, 30000.00),
(13, 'Lacio u ondas', 60, 18000.00),
(14, 'Semipermanente', 60, 0.00),
(15, 'Capping', 75, 0.00),
(16, 'Soft gel', 90, 0.00),
(17, 'Maquillaje social', 60, 0.00),
(18, 'Maquillaje novia', 120, 0.00),
(19, 'Maquillaje quinceañera', 90, 0.00),
(20, 'Maquillaje artístico', 90, 0.00),
(21, 'Maquillaje noche/día', 60, 0.00),
(22, 'Combo 1: Limpieza Facial + Dermaplaning + Shock de hidratación + Masaje Facial', 90, 0.00),
(23, 'Combo 2: Radiofrecuencia + Perfilado y diseño de cejas + Limpieza Facial + Terapia Capilar', 90, 0.00),
(24, 'Combo 3: Peeling + Tratamiento Facial + Relax Premium', 75, 0.00),
(25, 'Lifting de pestañas + botox + nutrición', 60, 13500.00),
(26, 'Lifting de pestañas + botox + nutrición + tinte', 75, 5000.00),
(27, 'Diseño de cejas + perfilado', 30, 10000.00),
(28, 'Diseño de cejas + perfilado + tinte', 40, 12000.00),
(29, 'Laminado de cejas + diseño + perfilado + botox', 60, 5000.00),
(30, 'Laminado de cejas + diseño + perfilado + botox + tinte', 70, 16500.00),
(31, 'Combo: Lifting de pestañas + botox + diseño de cejas + perfilado', 90, 18500.00),
(32, 'Combo: Lifting + nutrición + diseño de cejas + perfilado + tinte', 100, 20000.00),
(33, 'Combo: Lifting + nutrición + laminado de cejas + diseño + perfilado', 110, 22500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(30) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_profesional` int(11) DEFAULT NULL,
  `id_servicio` int(11) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--


--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_servicio` (`id_servicio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
