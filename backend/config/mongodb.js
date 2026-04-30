import mongoose from 'mongoose'
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ DB Connected')
  })

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/pedalzone`)
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB
