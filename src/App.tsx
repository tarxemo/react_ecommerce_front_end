import { ApolloProvider } from "@apollo/client";
import client from "./api/apolloClient";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <AppRoutes /> {/* This will render all your routes */}
      </div>
    </ApolloProvider>
  );
};

export default App;
