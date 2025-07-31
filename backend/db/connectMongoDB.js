import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`❌ MongoDB Connection Error: ${error.message}`);
		process.exit(1);
	}
};

export default connectMongoDB;
