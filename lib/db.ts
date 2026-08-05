import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!

export async function connectDB() {

    try {

        if (mongoose.connection.readyState === 1) {

            console.log('MongoDB already connected');
            return
            
            
        }

        await mongoose.connect(MONGO_URI)

        console.log("MongoDb connected successfully");
        
        
    } catch (error) {

        console.log("Database connection failed", error);

         // Throw the error so the API route can handle it

         throw new Error("Failed to connect to the database")
        
        
    }
}