import express from "express";
import mongoose from "mongoose";
import colors from "colors";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import schema from "./schema/schema.js";

dotenv.config();

const app = express();
const port = process.env.PORT || "5000";
const dbUrl = process.env.MONGO_URI;
app.use(cors());
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: process.env.NODE_ENV === "development",
	})
);

const startServer = async () => {
	try {
		await mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("connnected to DB ✔️".cyan.underline.italic.bold);
		app.listen(
			port,
			console.log(
				`Server is listening on port ${port}`.cyan.underline.italic.bold
			)
		);
	} catch (error) {
		console.log("failed to connect to the DB ❌".red.underline.italic.bold);
		console.log({ error });
	}
};

startServer();
