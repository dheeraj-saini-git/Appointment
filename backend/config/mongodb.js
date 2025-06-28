import mongoose from "mongoose";

async function connectDB() {
  try {
    mongoose.connection.on('connected', () => {
      console.log("Database Connected");
      // console.log(`${process.env.ADMIN_EMAIL}`)
    });

    await mongoose.connect(`${process.env.MONGODB_URL}/apollo`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export default connectDB;
