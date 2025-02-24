import mongoose from 'mongoose';
//coonection to mongodb
const connectDB = async () => {
    mongoose.connection.on('connected',()=>
    console.log("MongoDB connected")
    )

    await mongoose.connect(`${process.env.MONGO_URI}/lms`) 
}


export default connectDB;