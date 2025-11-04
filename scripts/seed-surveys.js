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

// Opciones de respuestas según tu estructura
const answers1 = ['muy_buena', 'buena', 'regular', 'mala', 'muy_mala', 'no_se'];
const answers2 = ['mucho_mejor', 'mejor', 'igual', 'peor', 'mucho_peor'];
const answers3 = [
  'primario_incompleto',
  'primario_completo',
  'secundario_incompleto',
  'secundario_completo',
  'universitario_incompleto',
  'universitario_completo',
  'posgrado'
];
const answers4 = ['masculino', 'femenino', 'otro', 'prefiero_no_decir'];

// Nombres argentinos comunes
const nombres = [
  'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Diego', 'Sofía',
  'Martín', 'Florencia', 'Pablo', 'Camila', 'Javier', 'Valentina', 'Matías',
  'Carolina', 'Federico', 'Natalia', 'Sebastián', 'Lucía', 'Nicolás', 'Victoria',
  'Facundo', 'Agustina', 'Santiago', 'Micaela', 'Tomás', 'Rocío', 'Gonzalo',
  'Julieta', 'Emiliano', 'Paula', 'Maximiliano', 'Daniela', 'Franco', 'Celeste',
  'Rodrigo', 'Marina', 'Lucas', 'Silvina', 'Ezequiel', 'Gabriela', 'Cristian',
  'Alejandra', 'Fernando', 'Mariana', 'Claudio', 'Verónica', 'Gustavo', 'Andrea',
  'Demian', 'Romina', 'Hernán', 'Vanesa', 'Adrián', 'Soledad', 'Marcelo', 'Paola'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber() {
  // Formato argentino: 549 + código de área + número
  const areaCodes = ['11', '351', '341', '261', '221', '223', '294', '380'];
  const areaCode = getRandomElement(areaCodes);
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `549${areaCode}${number}`;
}

function getRandomDate(daysBack = 3) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * daysBack);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  return now - (randomDays * 24 * 60 * 60 * 1000) - (randomHours * 60 * 60 * 1000) - (randomMinutes * 60 * 1000);
}

function generateSurvey() {
  const startTime = getRandomDate(3);
  const completedTime = startTime + Math.floor(Math.random() * 300000); // 0-5 minutos después
  const createdAt = completedTime + Math.floor(Math.random() * 1000); // Milisegundos después
  
  return {
    phoneNumber: generatePhoneNumber(),
    userName: getRandomElement(nombres),
    answers: {
      "1": getRandomElement(answers1),
      "2": getRandomElement(answers2),
      "3": getRandomElement(answers3),
      "4": getRandomElement(answers4)
    },
    startTime: { $date: { $numberLong: startTime.toString() } },
    completedTime: { $date: { $numberLong: completedTime.toString() } },
    status: "completed",
    createdAt: { $date: { $numberLong: createdAt.toString() } },
    updatedAt: { $date: { $numberLong: createdAt.toString() } },
    __v: 0
  };
}

async function seedDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db('guazu-bot');
    const collection = db.collection('surveys');
    
    // Generar 100 encuestas
    const surveys = [];
    for (let i = 0; i < 100; i++) {
      surveys.push(generateSurvey());
    }
    
    console.log(`📝 Generando ${surveys.length} encuestas de prueba...`);
    
    // Insertar en la base de datos
    const result = await collection.insertMany(surveys);
    
    console.log(`✅ Se insertaron ${result.insertedCount} encuestas exitosamente`);
    
    // Mostrar estadísticas
    const total = await collection.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await collection.countDocuments({
      'createdAt.$date.$numberLong': {
        $gte: today.getTime().toString()
      }
    });
    
    console.log(`\n📊 Estadísticas:`);
    console.log(`   Total de encuestas: ${total}`);
    console.log(`   Encuestas de hoy: ${todayCount}`);
    
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await client.close();
    console.log('\n👋 Conexión cerrada');
  }
}

seedDatabase();

