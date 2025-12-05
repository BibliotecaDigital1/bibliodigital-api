-- =============================================
-- 1. INSERTAR ROLES PRIMERO
-- =============================================
INSERT INTO roles (name) VALUES
('ADMIN'),
('CUSTOMER'),
('AUTHOR')
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. INSERTAR USUARIOS (Credenciales de Acceso)
-- =============================================
-- Contraseña para todos los usuarios: 123 (hash BCrypt)
INSERT INTO users (email, password, role_id) VALUES
('admin@biblioteca.com', '$2a$10$N9qo8uLOickgx2zmEeKR8.8VHq6Q7N2RZQ/Sg0TRZYr4F7v1YqN/u', (SELECT id FROM roles WHERE name = 'ADMIN')),
('cliente@biblioteca.com', '$2a$10$N9qo8uLOickgx2zmEeKR8.8VHq6Q7N2RZQ/Sg0TRZYr4F7v1YqN/u', (SELECT id FROM roles WHERE name = 'CUSTOMER')),
('autor@biblioteca.com', '$2a$10$N9qo8uLOickgx2zmEeKR8.8VHq6Q7N2RZQ/Sg0TRZYr4F7v1YqN/u', (SELECT id FROM roles WHERE name = 'AUTHOR'))
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. INSERTAR CATEGORÍAS
-- =============================================
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Ficción', 'Libros de narrativa ficticia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('No Ficción', 'Libros de contenido real y factual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ciencia', 'Libros relacionados con ciencia y tecnología', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Historia', 'Libros sobre eventos históricos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Biografía', 'Libros que narran la vida de personas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Infantil', 'Libros para niños', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. INSERTAR AUTORES
-- =============================================
INSERT INTO authors (first_name, last_name, bio, created_at, updated_at) VALUES
('Gabriel', 'García Márquez', 'Autor colombiano de "Cien Años de Soledad".', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Isabel', 'Allende', 'Escritora chilena conocida por "La Casa de los Espíritus".', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jorge', 'Luis Borges', 'Escritor argentino de cuentos cortos y ensayos.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mario', 'Vargas Llosa', 'Escritor peruano galardonado con el Premio Nobel.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Laura', 'Esquivel', 'Autora mexicana de "Como Agua para Chocolate".', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carlos', 'Fuentes', 'Novelista mexicano famoso por "La Muerte de Artemio Cruz".', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. INSERTAR LIBROS
-- =============================================
INSERT INTO books (title, slug, description, price, cover_path, file_path, created_at, updated_at, category_id, author_id) VALUES
('Cien Años de Soledad', 'cien-anos-de-soledad', 'Una novela épica de la familia Buendía en el ficticio pueblo de Macondo.', 29.99, '/covers/cien-anos-de-soledad.jpg', '/files/cien-anos-de-soledad.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
('La Casa de los Espíritus', 'la-casa-de-los-espiritus', 'Una saga familiar que combina elementos de realismo mágico.', 24.99, '/covers/la-casa-de-los-espiritus.jpg', '/files/la-casa-de-los-espiritus.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
('Ficciones', 'ficciones', 'Una colección de cuentos cortos que exploran temas complejos como la metafísica y el infinito.', 19.99, '/covers/ficciones.jpg', '/files/ficciones.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
('La Ciudad y los Perros', 'la-ciudad-y-los-perros', 'Un retrato de la vida en un internado militar en Lima, Perú.', 22.50, '/covers/la-ciudad-y-los-perros.jpg', '/files/la-ciudad-y-los-perros.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 4),
('Como Agua para Chocolate', 'como-agua-para-chocolate', 'Una novela que combina la gastronomía con el realismo mágico en la Revolución Mexicana.', 17.75, '/covers/como-agua-para-chocolate.jpg', '/files/como-agua-para-chocolate.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 5),
('La Muerte de Artemio Cruz', 'la-muerte-de-artemio-cruz', 'Una narrativa innovadora sobre la vida de un magnate corrupto durante la Revolución Mexicana.', 21.00, '/covers/la-muerte-de-artemio-cruz.jpg', '/files/la-muerte-de-artemio-cruz.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. INSERTAR CLIENTES (Vinculados a Usuarios)
-- =============================================
INSERT INTO customers (first_name, last_name, shipping_address, created_at, updated_at, user_id)
VALUES
('Admin', 'Usuario', 'Dirección Admin 123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM users WHERE email = 'admin@biblioteca.com')),
('Cliente', 'Demo', 'Calle Principal 456, Lima', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM users WHERE email = 'cliente@biblioteca.com'))
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. INSERTAR AUTOR DEMO (Vinculado a Usuario)
-- =============================================
INSERT INTO authors (first_name, last_name, bio, created_at, updated_at, user_id)
VALUES
('Autor', 'Demo', 'Autor de prueba del sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (SELECT id FROM users WHERE email = 'autor@biblioteca.com'))
ON CONFLICT DO NOTHING;