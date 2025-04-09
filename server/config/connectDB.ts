import mongoose from "mongoose";

const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY = 5000; // Delay between retries in milliseconds

async function connectDB() {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not defined");
  }

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
        socketTimeoutMS: 45000, // Timeout for socket operations
      });

      const connection = mongoose.connection;

      // Event listeners for MongoDB connection
      connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });

      connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process on connection error
      });

      connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
      });

      connection.on("reconnected", () => {
        console.log("MongoDB reconnected");
      });

      console.log("MongoDB connection established successfully.");
      return; // Exit the function if the connection is successful
    } catch (error) {
      retries++;
      console.error(`Connection attempt ${retries} failed:`, error);

      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error("Max retries reached. Exiting...");
        process.exit(1); // Exit the process if max retries are reached
      }
    }
  }
}

export default connectDB;
