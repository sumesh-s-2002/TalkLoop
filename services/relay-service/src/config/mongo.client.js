import mongoose from "mongoose";
import { config } from "dotenv";
config();

export async function initClient() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("Something went wrong while connecting to MongoDB!");
        throw err;
    }
}