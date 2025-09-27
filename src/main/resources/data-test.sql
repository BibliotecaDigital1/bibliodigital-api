INSERT INTO roles (name) VALUES
('ADMIN'),
('CUSTOMER'),
('AUTHOR')
ON CONFLICT DO NOTHING;
-- Users
INSERT INTO users (email, password, role_id) VALUES
('admin@bookstore.com', 'admin123', 1),
('johndoe@example.com', 'user123', 2),
('janedoe@example.com', 'author123', 3)
ON CONFLICT DO NOTHING;
-- Categorías
INSERT INTO categories (name, description, created_at, updated_at)
VALUES
('Ficción', 'Libros de narrativa ficticia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('No Ficción', 'Libros de contenido real y factual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ciencia', 'Libros científicos y técnicos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
-- Authors
INSERT INTO authors (first_name, last_name, bio,created_at, updated_at, user_id) VALUES
('Jane', 'Doe', 'Autora de novelas de ciencia ficción', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3)
ON CONFLICT DO NOTHING;
-- Customers
INSERT INTO customers (first_name, last_name, shipping_address,created_at, updated_at, user_id) VALUES
('John', 'Doe', 'Calle Falsa 123, Lima, Perú', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2)
ON CONFLICT DO NOTHING;
-- Books
INSERT INTO books (title, slug, description, price,created_at, updated_at, category_id, author_id) VALUES
('El Viaje Cósmico', 'el-viaje-cosmico', 'Una novela sobre viajes intergalácticos', 29.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
('Historia del Mundo', 'historia-del-mundo', 'Libro de historia universal', 34.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1)
ON CONFLICT DO NOTHING;
-- Collections
INSERT INTO collections (name,created_at, updated_at, customer_id) VALUES
('Favoritos de John', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
ON CONFLICT DO NOTHING;
-- Collection_books
INSERT INTO collection_books (book_id, collection_id, added_date) VALUES
(1, 1,CURRENT_TIMESTAMP),
(2, 1,CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
-- Purchases
INSERT INTO purchases (total, payment_status, user_id) VALUES
(64.49, 'PAID', 2)
ON CONFLICT DO NOTHING;
-- Purchase_items
INSERT INTO purchase_items (price, quantity, book_id, purchase_id) VALUES
(29.99, 1, 1, 1),
(34.50, 1, 2, 1)
ON CONFLICT DO NOTHING;
-- Chat messages
INSERT INTO chat_messages (content, sender_id,created_at) VALUES
('Hola, ¿tienen descuentos en ciencia ficción?', 2,CURRENT_TIMESTAMP)
 ON CONFLICT DO NOTHING;