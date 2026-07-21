const pool = require('./config/db');
require('dotenv').config();

async function addFotoColumn() {
  try {
    console.log('🔧 Añadiendo columna foto_url a tabla productos...');
    
    await pool.query(`
      ALTER TABLE productos 
      ADD COLUMN IF NOT EXISTS foto_url VARCHAR(255);
    `);
    
    console.log('✅ Columna foto_url añadida exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addFotoColumn();
