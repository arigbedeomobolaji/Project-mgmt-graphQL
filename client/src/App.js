import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				clients: {
					merge(existing, incoming) {
						return incoming;
					},
				},
				// project
				projects: {
					merge(existing, incoming) {
						return incoming;
					},
				},
			},
		},
	},
});
const client = new ApolloClient({
	uri: "http://localhost:5000/graphql",
	cache,
});
function App() {
	return (
		<>
			<ApolloProvider client={client}>
				<Router>
					<Header />
					<div className="container">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/projects/:id"
								element={<Projects />}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</Router>
			</ApolloProvider>
		</>
	);
}

export default App;
