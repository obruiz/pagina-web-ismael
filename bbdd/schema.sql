-- Tabla para la información "Sobre mí"
CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para la experiencia profesional
CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para los proyectos
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para la información de contacto
CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    email TEXT NOT NULL,
    button_text TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
INSERT OR IGNORE INTO about (title, content) VALUES 
('Sobre mí', 'Soy un ingeniero químico apasionado por la innovación y la mejora continua de procesos industriales. Mi experiencia se centra en el desarrollo y optimización de procesos químicos, con un fuerte énfasis en la sostenibilidad y la eficiencia energética.');

INSERT OR IGNORE INTO experience (position, company, period, description) VALUES 
('Ingeniero de Procesos', 'Empresa Química S.A.', '2020 - Presente', 'Desarrollo y optimización de procesos químicos industriales. Implementación de mejoras en eficiencia energética. Gestión de equipos y proyectos de innovación.');

INSERT OR IGNORE INTO projects (title, description) VALUES 
('Optimización de Planta Química', 'Proyecto de mejora de eficiencia energética que resultó en una reducción del 30% en el consumo de energía.');

INSERT OR IGNORE INTO contact (title, description, email, button_text) VALUES 
('Contacto', '¿Interesado en colaborar? ¡Contáctame!', 'tu@email.com', 'Enviar email');

-- Insertar usuario administrador por defecto (contraseña: ismael2024)
-- En un entorno real, esto debería hashearse adecuadamente
INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES 
('admin', 'ismael2024'); 