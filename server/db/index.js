import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstanace = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("Connection Success for: ", connectionInstanace?.connection?.name);
    } catch (error) {
        console.log("MongoDB Connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;