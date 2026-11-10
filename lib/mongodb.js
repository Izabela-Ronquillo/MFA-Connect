const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cached = global._mongo || { conn: null, promise: null };
global._mongo = cached;

async function connectToDatabase() {
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then((client) => {
      const dbName = process.env.MONGODB_DB || 'mfa_connect';
      return { client, db: client.db(dbName) };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectToDatabase };
