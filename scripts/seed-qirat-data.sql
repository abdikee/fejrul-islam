-- Seed Data for Qirat and Ilm Course System

-- Level 1 Books (10 books across 6 categories)
INSERT INTO qirat_books (level_id, book_number, title, category, description, order_index) VALUES
-- Aqida Books
(1, 1, 'Usul al-Iman', 'Aqida', 'Foundations of Islamic Faith', 1),
(1, 2, 'Tawhid al-Asma wa Sifat', 'Aqida', 'Unity of Allah Names and Attributes', 2),
-- Hadis Books
(1, 3, 'Forty Hadith - Part 1', 'Hadis', 'Essential Prophetic Traditions', 3),
-- Musxalah Books
(1, 4, 'Fiqh al-Salah', 'Musxalah', 'Jurisprudence of Prayer', 4),
(1, 5, 'Ahkam al-Tahara', 'Musxalah', 'Rules of Purification', 5),
-- Fiqh Books
(1, 6, 'Fiqh al-Ibadat', 'Fiqh', 'Jurisprudence of Worship', 6),
-- Nahw Books
(1, 7, 'Al-Ajrumiyyah', 'Nahw', 'Arabic Grammar Basics', 7),
(1, 8, 'Qawaid al-Lugha', 'Nahw', 'Language Rules', 8),
-- Sira Books
(1, 9, 'Sirat al-Nabi - Early Life', 'Sira', 'Biography of Prophet Muhammad (PBUH)', 9),
(1, 10, 'Companions of the Prophet', 'Sira', 'Stories of the Sahaba', 10);

-- Level 2 Books
INSERT INTO qirat_books (level_id, book_number, title, category, description, order_index) VALUES
(2, 1, 'Aqida al-Wasitiyyah', 'Aqida', 'Intermediate Creed Studies', 11),
(2, 2, 'Al-Qadar wa al-Qada', 'Aqida', 'Divine Decree and Destiny', 12),
(2, 3, 'Forty Hadith - Part 2', 'Hadis', 'Advanced Prophetic Traditions', 13),
(2, 4, 'Fiqh al-Zakat', 'Musxalah', 'Jurisprudence of Charity', 14),
(2, 5, 'Fiqh al-Sawm', 'Musxalah', 'Jurisprudence of Fasting', 15),
(2, 6, 'Fiqh al-Muamalat', 'Fiqh', 'Islamic Transactions', 16),
(2, 7, 'Qatru al-Nada', 'Nahw', 'Intermediate Arabic Grammar', 17),
(2, 8, 'Al-Balagha', 'Nahw', 'Arabic Rhetoric', 18),
(2, 9, 'Sirat al-Nabi - Madinan Period', 'Sira', 'Prophet in Medina', 19),
(2, 10, 'Islamic Conquests', 'Sira', 'Expansion of Islam', 20);

-- Level 3 Books
INSERT INTO qirat_books (level_id, book_number, title, category, description, order_index) VALUES
(3, 1, 'Aqida al-Tahawiyyah', 'Aqida', 'Advanced Islamic Creed', 21),
(3, 2, 'Al-Asma al-Husna', 'Aqida', 'The Beautiful Names of Allah', 22),
(3, 3, 'Sahih al-Bukhari - Selected', 'Hadis', 'Authentic Hadith Collection', 23),
(3, 4, 'Fiqh al-Hajj', 'Musxalah', 'Jurisprudence of Pilgrimage', 24),
(3, 5, 'Fiqh al-Jihad', 'Musxalah', 'Jurisprudence of Struggle', 25),
(3, 6, 'Fiqh al-Usra', 'Fiqh', 'Family Jurisprudence', 26),
(3, 7, 'Alfiyyah Ibn Malik', 'Nahw', 'Advanced Arabic Grammar', 27),
(3, 8, 'Ilm al-Bayan', 'Nahw', 'Science of Eloquence', 28),
(3, 9, 'Sirat al-Khulafa', 'Sira', 'Biography of the Caliphs', 29),
(3, 10, 'Islamic Civilization', 'Sira', 'History of Islamic Golden Age', 30);

SELECT 'Sample books inserted successfully!' as status;
SELECT COUNT(*) as total_books FROM qirat_books;
