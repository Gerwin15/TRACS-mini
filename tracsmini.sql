-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2025 at 10:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `retsej_ui`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `status`) VALUES
(2, 'Eunice', 'eunice_serrano@rcc.edu.ph', '$2y$10$HLq9Q.lw.11Cq6AjIh86DOf0M7.PTd3kbUXL8co6NOVNsv8xO6y8O', '2025-09-07 10:28:48', 'active'),
(3, 'Joel', 'joel_fajardo@rcc.edu.ph', '$2y$10$FktoYye.YUcGgFHzVx74YOGR8wJ7I4Cwje5EKJN8Cc.1j63TckZau', '2025-09-07 10:42:45', 'active'),
(4, 'gerwin', 'gerwin_cando@rcc.edu.ph', '$2y$10$uRTVVMrtCAyO4UUITDTLlOGFBUYtxR2QGepiEjbFP.JGaOYYjvJ1m', '2025-09-19 06:12:24', 'active'),
(5, 'trs', 'gerwinmcpe@gmail.com', '$2y$10$HfS0Prvv6/y5DelJlkVmduPBWT/8jwyrdtv7ZhrU/lJTas36yGW2u', '2025-09-19 06:17:54', 'active'),
(6, '123', 'gersamcan@gmail.com', '$2y$10$EkDpUqo/cVa9yI6DfbKBRuTyhdrvcqteYEv7KKpkZAP.hl2RAjcq6', '2025-09-19 06:20:01', 'inactive'),
(7, 'admin', 'gerwincando.s@gmail.com', '$2y$10$wWGqo3XFSMWx9HsexqUC0u1P.aRClkKKpMoTc2F.g.tenaRhpHUXm', '2025-09-19 06:59:18', 'inactive'),
(11, '1234', '1234@gmail.com', '$2y$10$0za3I/lCX5x2KFAUXe6yPuhlJaRg.P94mHJ0q4AvnKsUSl0JAbgTK', '2025-09-19 08:11:49', 'active'),
(29, 'Clouie', 'clouie@gmail.com', '$2y$10$103TXuvj.X358h3VWRSuIehwSaQDWVTajnUoNtLt9aLyhmLsKpsIW', '2025-09-19 08:43:43', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
