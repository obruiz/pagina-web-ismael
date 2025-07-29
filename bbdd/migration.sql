-- Migración para agregar soporte bilingüe a la tabla about
ALTER TABLE about ADD COLUMN content_es TEXT;
ALTER TABLE about ADD COLUMN content_en TEXT;

-- Inicializar las nuevas columnas con valores por defecto
UPDATE about SET 
    content_es = content,
    content_en = 'I am a chemical engineer passionate about innovation and continuous improvement of industrial processes. My experience focuses on the development and optimization of chemical processes, with a strong emphasis on sustainability and energy efficiency.'
WHERE content_es IS NULL; 