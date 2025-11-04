const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Leer .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
const uri = uriMatch ? uriMatch[1].trim() : '';

if (!uri) {
  console.error('❌ No se encontró MONGODB_URI en .env.local');
  process.exit(1);
}

const client = new MongoClient(uri);

async function clearDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('guazu-bot');
    const collection = db.collection('surveys');
    
    // Contar documentos antes de borrar
    const countBefore = await collection.countDocuments();
    console.log(`📊 Encuestas actuales: ${countBefore}`);
    
    // Preguntar confirmación
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('⚠️  ¿Estás seguro de que quieres borrar TODAS las encuestas? (escribe "SI" para confirmar): ', async (answer) => {
      if (answer.trim().toUpperCase() === 'SI') {
        const result = await collection.deleteMany({});
        console.log(`✅ Se eliminaron ${result.deletedCount} encuestas`);
      } else {
        console.log('❌ Operación cancelada');
      }
      
      readline.close();
      await client.close();
      console.log('\n👋 Conexión cerrada');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    await client.close();
  }
}

clearDatabase();

