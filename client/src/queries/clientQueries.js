import { gql } from "@apollo/client";

// gqp is used to make query
// useQuery is used to make use of the query
export const GET_CLIENTS = gql`
	query getClients {
		clients {
			id
			name
			email
			phone
		}
	}
`;

export const GET_CLIENT = gql`
	query getClient($id: ID!) {
		client(id: $id) {
			id
			name
			email
			phone
		}
	}
`;
