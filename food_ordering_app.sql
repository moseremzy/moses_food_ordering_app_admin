-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2025 at 08:16 PM
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
-- Database: `food_ordering_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` int(50) DEFAULT NULL,
  `password_reset_token` varchar(250) NOT NULL,
  `password` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `phone`, `password_reset_token`, `password`) VALUES
(7, 'kendy@gmail.com', 7063, '', '$2a$12$Qw9LKLlHA9DITVFCvZ0LaO7r5ZPjiDEe5j9EkKr4CdvReeyoSLFGm');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `items_id` int(11) NOT NULL,
  `name` varchar(250) DEFAULT NULL,
  `category` enum('meals/sides','snacks','cakes','africana','drinks','bread') DEFAULT NULL,
  `sub_category` enum('swallow','soup','none') NOT NULL,
  `image` varchar(250) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`items_id`, `name`, `category`, `sub_category`, `image`, `price`, `description`) VALUES
(29, 'pounded yam', 'africana', 'swallow', '1736974635677-jonny-caspari-sQNq223Rr54-unsplash (2).jpg', 200, 'Delicous Poundy'),
(30, 'sardine breast', 'meals/sides', '', '1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg', 400, 'sweet'),
(31, 'pizza', 'snacks', '', '1736975646675-pexels-alleksana-4113682.jpg', 600, 'tasty'),
(32, 'shawarma', 'snacks', '', '1737020819933-jonny-caspari-sQNq223Rr54-unsplash (1).jpg', 2000, 'Delicious'),
(33, 'parfait', 'drinks', 'none', '1737117775240-1737065952752-images-1 (2).jpg', 6000, 'nice drink'),
(34, 'egusi soup', 'africana', 'soup', '1737024791314-jonny-caspari-sQNq223Rr54-unsplash.jpg', 0, ''),
(35, 'beans soup', 'africana', 'swallow', '1737124176402-1737065952752-images-1 (2).jpg', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(50) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `customer_name` varchar(250) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(250) NOT NULL,
  `date_created` varchar(50) DEFAULT NULL,
  `confirmation_pin` int(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `delivery_address` varchar(250) DEFAULT NULL,
  `sub_total_order_cost` int(50) NOT NULL,
  `total_order_cost` int(50) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `status` enum('Payment Pending','Payment Failed','Payment Abandoned','Payment Reversed','Pending','Confirmed','Preparing','Out for Delivery','Delivered','Cancelled') NOT NULL,
  `description` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_id`, `customer_name`, `phone`, `email`, `date_created`, `confirmation_pin`, `payment_method`, `delivery_address`, `sub_total_order_cost`, `total_order_cost`, `items`, `status`, `description`) VALUES
(38, 39, '70ddc28647', 'mo agbaoje', '7063131606', 'agbaojemoses@gmail.com', '2024-12-28 20:13:56', 8764, 'cash on delivery', '001 Hope Clinic street jattu', 700, 720, '[{\"items_id\":28,\"name\":\"cup cake\",\"category\":\"cakes\",\"image\":\"1734784832378-logo (5).png\",\"price\":700,\"description\":\"jjj\",\"quantity\":1,\"total\":700}]', 'Confirmed', 'Your order has been confirmed for processing'),
(39, 39, '5317234707', 'mo agbaoje', '7063131606', 'agbaojemoses@gmail.com', '2024-12-28 20:14:40', 6499, 'cash on delivery', '001 Hope Clinic street jattu', 700, 720, '[{\"items_id\":28,\"name\":\"cup cake\",\"category\":\"cakes\",\"image\":\"1734784832378-logo (5).png\",\"price\":700,\"description\":\"jjj\",\"quantity\":1,\"total\":700}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation.'),
(40, 39, '24fa92466f', 'mo agbaoje', '7063131606', 'agbaojemoses@gmail.com', '2024-12-28 20:15:16', 5437, 'card payment', '001 Hope Clinic street jattu', 700, 720, '[{\"items_id\":28,\"name\":\"cup cake\",\"category\":\"cakes\",\"image\":\"1734784832378-logo (5).png\",\"price\":700,\"description\":\"jjj\",\"quantity\":1,\"total\":700}]', 'Payment Abandoned', 'Your Order Has Been Recieved And is Awaiting Confirmation'),
(41, 42, '5a1ea003f9', 'Moses Agbaoje', '7063131606', 'agbaojemoses@gmail.com', '2025-01-16 11:17:44', 6761, 'card payment', '  ', 200, 220, '[{\"items_id\":29,\"name\":\"pounded yam\",\"category\":\"africana\",\"sub_category\":\"\",\"image\":\"1736974635677-jonny-caspari-sQNq223Rr54-unsplash (2).jpg\",\"price\":200,\"description\":\"Delicous Poundy\",\"quantity\":1,\"total\":200}]', 'Payment Pending', 'The payment has been initiated but is awaiting confirmation from the payment gateway'),
(42, 42, '6c99c61577', 'Moses Agbaoje', '7063131606', 'agbaojemoses@gmail.com', '2025-01-17 13:49:48', 1096, 'cash on delivery', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 800, 820, '[{\"items_id\":30,\"name\":\"sardine breast\",\"category\":\"meals/sides\",\"sub_category\":\"\",\"image\":\"1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg\",\"price\":400,\"description\":\"sweet\",\"quantity\":1,\"total\":400},{\"items_id\":29,\"name\":\"egusi soup and pounded yam\",\"category\":\"africana\",\"sub_category\":\"swallow\",\"image\":\"1736974635677-jonny-caspari-sQNq223Rr54-unsplash (2).jpg\",\"price\":200,\"description\":\"Delicous Poundy\",\"quantity\":2,\"total\":400}]', 'Cancelled', 'i no want again'),
(43, 44, '583f034d89', 'Moses Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '2025-04-13 12:44:32', 5845, 'card payment', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 400, 420, '[{\"items_id\":29,\"name\":\"egusi soup and pounded yam\",\"category\":\"africana\",\"sub_category\":\"swallow\",\"image\":\"1736974635677-jonny-caspari-sQNq223Rr54-unsplash (2).jpg\",\"price\":200,\"description\":\"Delicous Poundy\",\"quantity\":2,\"total\":400}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation'),
(44, 46, 'd81c198757', 'Moses Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '2025-04-14 09:54:34', 8118, 'cash on delivery', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 400, 420, '[{\"items_id\":30,\"name\":\"sardine breast\",\"category\":\"meals/sides\",\"sub_category\":\"\",\"image\":\"1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg\",\"price\":400,\"description\":\"sweet\",\"quantity\":1,\"total\":400}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation'),
(45, 46, 'baa18706d0', 'Moses Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '2025-04-14 10:03:01', 8282, 'cash on delivery', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 400, 420, '[{\"items_id\":30,\"name\":\"sardine breast\",\"category\":\"meals/sides\",\"sub_category\":\"\",\"image\":\"1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg\",\"price\":400,\"description\":\"sweet\",\"quantity\":1,\"total\":400}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation'),
(46, 46, 'c615054620', 'Moses Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '2025-04-14 10:08:18', 6084, 'cash on delivery', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 400, 420, '[{\"items_id\":30,\"name\":\"sardine breast\",\"category\":\"meals/sides\",\"sub_category\":\"\",\"image\":\"1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg\",\"price\":400,\"description\":\"sweet\",\"quantity\":1,\"total\":400}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation'),
(47, 46, '4da34b371c', 'Moses Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '2025-04-14 10:09:52', 4069, 'cash on delivery', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', 400, 420, '[{\"items_id\":30,\"name\":\"sardine breast\",\"category\":\"meals/sides\",\"sub_category\":\"\",\"image\":\"1736975597596-jonny-caspari-sQNq223Rr54-unsplash.jpg\",\"price\":400,\"description\":\"sweet\",\"quantity\":1,\"total\":400}]', 'Pending', 'Your Order Has Been Recieved And is Awaiting Confirmation');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('yaO6zKzw8dqlmg89FPBe0bVU0YcaDsh8', 1744887077, '{\"cookie\":{\"originalMaxAge\":7199480,\"expires\":\"2025-04-17T10:02:08.426Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"admin_id\":7,\"admin_isAuthenticated\":true}');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `market_status` enum('open','close') DEFAULT 'open',
  `service_fee` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `market_status`, `service_fee`) VALUES
(1, 'open', 20);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `account_status` enum('Verified','Unverified') NOT NULL DEFAULT 'Unverified',
  `confirmation_code` varchar(50) NOT NULL,
  `delivery_address` varchar(250) NOT NULL,
  `password_reset_token` varchar(250) NOT NULL,
  `date_created` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `phone`, `email`, `password`, `account_status`, `confirmation_code`, `delivery_address`, `password_reset_token`, `date_created`) VALUES
(3, 'mose', 'agbaoje', '081116350276', 'joelagbaoje@gmail.com', '$2a$12$5QKMO7whN3ECpWZjC.UQ6O1jnNd.8JRBpEoQMFBus8KZmEFYaT3Oq', 'Unverified', 'c4655bc9-d334-4862-bffc-cd3110e522cf', '', '', '2024-12-20 09:38:12'),
(46, 'Moses', 'Agbaoje', '07063131606', 'agbaojemoses@gmail.com', '$2a$12$rBmB.rINBb.Flzn3GOjBguYPGV7L3e1QaYi7VsAqKMw2YXnANUy7q', 'Verified', '8a079fcb-b772-48ab-a107-b49aabaf291e', 'NO. 001 HOPE CLINIC STREET, B/S BRIGHT WAY SCHOOL JATTU', '', '2025-04-14 09:22:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`items_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `items_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
