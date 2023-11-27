import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLSchema,
	GraphQLList,
	GraphQLEnumType,
} from "graphql";
import Client from "../models/Client.js";
import Project from "../models/Project.js";

// When you have multiple resources like clients, projects, users
// you will need to create a type for each resource
// Client Type
const ClientType = new GraphQLObjectType({
	name: "Client",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
});

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		// This is how relationship are added.
		client: {
			type: ClientType,
			resolve(parent, args) {
				return Client.findById(parent.clientId);
			},
		},
	}),
});

// This is similar to get in REST_API
// To get a data from a datasource.
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		// To fetch all clients
		clients: {
			type: new GraphQLList(ClientType),
			resolve() {
				return Client.find();
			},
		},
		// This below is to fetch a client.
		// To get a client
		// To make a query let's say we want to get a client by the ID
		// then we need to create our root query object
		client: {
			type: ClientType,
			// We'll be passing in the id of the client we want to get using args
			args: { id: { type: GraphQLID } },
			// resolve is what we want to be returned.
			resolve(parent, args) {
				// Here is where we want to return our data usimg our db (orm) function
				return Client.findById(args.id);
			},
		},
		projects: {
			type: new GraphQLList(ProjectType),
			resolve() {
				return Project.find();
			},
		},
		project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Project.findById(args.id);
			},
		},
	},
});

// Mutation
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addClient: {
			type: ClientType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				phone: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const newClient = new Client({
					name: args.name,
					email: args.email,
					phone: args.phone,
				});
				return newClient.save();
			},
		},
		deleteClient: {
			type: ClientType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				Project.find({ clientId: args.id }).then((projects) => {
					projects.forEach((project) => {
						project.deleteOne();
					});
				});
				return Client.findByIdAndRemove(args.id);
			},
		},
		// Add a project
		addProject: {
			type: ProjectType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				clientId: { type: new GraphQLNonNull(GraphQLID) },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatus",
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
					defaultValue: "Not Started",
				},
			},
			resolve(parent, { name, description, clientId, status }) {
				const newProject = new Project({
					name,
					description,
					clientId,
					status,
				});
				return newProject.save();
			},
		},
		// Delete a Project
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Project.findByIdAndRemove(args.id);
			},
		},
		// update a project
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatusUpdate", //Must be unique
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
				},
			},
			resolve(parent, { name, description, status, ...args }) {
				return Project.findByIdAndUpdate(
					args.id,
					{
						name,
						description,
						status,
					},

					{ new: true }
				);
			},
		},
		// next task
	},
});

export default new GraphQLSchema({
	query: RootQuery,
	mutation,
});

// You use queries when you are fetching or getting data while you use
// mutation to add, update or delete data
