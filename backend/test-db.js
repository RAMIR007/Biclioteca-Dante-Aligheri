const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_0jckWfvXd7Ee@ep-billowing-smoke-ap5ya60z-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connecting...');
  const start = Date.now();
  try {
    await client.connect();
    const end = Date.now();
    console.log(`Connected in ${end - start}ms`);
    
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    
    await client.end();
    console.log('Connection closed');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConnection();
