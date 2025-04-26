// lib/database.ts
import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Por favor, define la variable de entorno MONGODB_URI en tu archivo .env.local');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extiende el objeto global para incluir la caché de la conexión
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export const connectToDataBase = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);

    const options: ConnectOptions = {
      dbName: 'MY_DB',
    };

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Conexión a la base de datos establecida correctamente');
    return cached.conn;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};
