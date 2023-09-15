import mongoose, { Schema, model } from "mongoose";

export const ClientSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, required: true, unique: true },
});

const Client = model("Client", ClientSchema);
export default Client;
