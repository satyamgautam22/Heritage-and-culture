import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/heritage-and-culture`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connection done `);
  } catch (error) {
    console.error(`Error while connecting ${error}`);
  
  }
};
 

export default connectDB;
