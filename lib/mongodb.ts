import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wnsrb2898:5SgMy35uNBR0NgL1@cluster0.sukynpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalWithMongoose {
  mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

let cached = (global as unknown as GlobalWithMongoose).mongoose

if (!cached) {
  cached = (global as unknown as GlobalWithMongoose).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect