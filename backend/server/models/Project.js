import mongoose, { Schema, model } from "mongoose";

export const ProjectSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	status: {
		type: String,
		enum: ["Not Started", "In Progress", "Completed"],
	},
	clientId: {
		ref: "Client",
		type: Schema.Types.ObjectId,
	},
});

const Project = model("Project", ProjectSchema);
export default Project;
