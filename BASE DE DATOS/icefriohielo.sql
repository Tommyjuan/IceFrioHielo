-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS icefriohielo;
USE icefriohielo;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cliente') DEFAULT 'cliente',
    reset_token VARCHAR(255)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen TEXT,  -- Puedes guardar solo el nombre o la URL del archivo
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    categoria ENUM('Dulces', 'Granizadoras', 'Insumos') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP);