import { clients, projects } from "../sampleData.js";
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLSchema,
	GraphQLList,
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
	name: "projects",
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

export default new GraphQLSchema({
	query: RootQuery,
});

// You use queries when you are fetching or getting data while you use
// mutation to add, update or delete data
