#!/usr/bin/env node

/**
 * Script de configuración automática para el worker de base de datos
 * Automatiza la creación y configuración de la base de datos D1
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando el worker de base de datos...\n');

async function main() {
  try {
    // 1. Verificar que wrangler esté instalado
    console.log('1️⃣ Verificando dependencias...');
    try {
      execSync('wrangler --version', { stdio: 'pipe' });
      console.log('✅ Wrangler está instalado\n');
    } catch (error) {
      console.log('❌ Wrangler no está instalado. Instalando...');
      execSync('npm install -g wrangler', { stdio: 'inherit' });
      console.log('✅ Wrangler instalado correctamente\n');
    }

    // 2. Verificar autenticación
    console.log('2️⃣ Verificando autenticación con Cloudflare...');
    try {
      execSync('wrangler whoami', { stdio: 'pipe' });
      console.log('✅ Ya estás autenticado con Cloudflare\n');
    } catch (error) {
      console.log('⚠️  Necesitas autenticarte con Cloudflare');
      console.log('Ejecuta: wrangler auth login');
      process.exit(1);
    }

    // 3. Crear base de datos D1 si no existe
    console.log('3️⃣ Configurando base de datos D1...');
    
    // Leer configuración actual
    const wranglerConfigPath = path.join(__dirname, 'wrangler.jsonc');
    let wranglerConfig;
    
    try {
      const configContent = fs.readFileSync(wranglerConfigPath, 'utf8');
      // Remover comentarios JSON para parsear
      const cleanConfig = configContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      wranglerConfig = JSON.parse(cleanConfig);
    } catch (error) {
      console.log('❌ Error leyendo wrangler.jsonc');
      process.exit(1);
    }

    // Verificar si ya tiene base de datos configurada
    if (wranglerConfig.d1_databases && wranglerConfig.d1_databases.length > 0) {
      const dbName = wranglerConfig.d1_databases[0].database_name;
      const dbId = wranglerConfig.d1_databases[0].database_id;
      
      console.log(`📊 Base de datos encontrada: ${dbName} (${dbId})`);
      
      // Verificar si la base de datos existe en Cloudflare
      try {
        execSync(`wrangler d1 list | grep ${dbId}`, { stdio: 'pipe' });
        console.log('✅ Base de datos existe en Cloudflare\n');
      } catch (error) {
        console.log('⚠️  La base de datos no existe en Cloudflare. Créala manualmente o actualiza la configuración.');
      }
    } else {
      console.log('📊 Creando nueva base de datos D1...');
      try {
        const output = execSync('wrangler d1 create ismael-web-db', { encoding: 'utf8' });
        console.log('✅ Base de datos creada\n');
        console.log('🔧 Por favor actualiza wrangler.jsonc con la información mostrada arriba\n');
        console.log(output);
      } catch (error) {
        console.log('❌ Error creando la base de datos');
        console.log(error.message);
      }
    }

    // 4. Aplicar esquema
    console.log('4️⃣ Aplicando esquema de base de datos...');
    try {
      const dbName = wranglerConfig.d1_databases[0].database_name;
      execSync(`wrangler d1 execute ${dbName} --file=./schema.sql`, { stdio: 'inherit' });
      console.log('✅ Esquema aplicado correctamente\n');
    } catch (error) {
      console.log('⚠️  Error aplicando esquema. Ejecuta manualmente:');
      console.log(`wrangler d1 execute ${wranglerConfig.d1_databases[0].database_name} --file=./schema.sql\n`);
    }

    // 5. Instrucciones finales
    console.log('🎉 ¡Configuración completada!\n');
    console.log('📋 Próximos pasos:');
    console.log('   1. Ejecuta "npm run dev" para probar localmente');
    console.log('   2. Ejecuta "npm run deploy" para desplegar a producción');
    console.log('   3. Revisa el README.md para más información\n');
    
    console.log('🔗 Endpoints disponibles:');
    console.log('   • GET  /content/all - Obtener todo el contenido');
    console.log('   • POST /auth/login  - Autenticación');
    console.log('   • PUT  /admin/*     - Administración (requiere auth)\n');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar script principal
main().catch(console.error); 