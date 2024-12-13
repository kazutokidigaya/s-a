import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    if (!res) console.log(res);

    console.log("Connected to DB");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDb;
