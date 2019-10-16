import React from "react";
import { AccountProvider } from "@jmhudak/strapi-auth";
import Dashboard from "./Dashboard";
import { hot } from "react-hot-loader";
import PrivateRoute from "components/PrivateRoute";
import { ThemeProvider } from "emotion-theming";
import Login from "Login";
import { Box, Heading, Button } from "rebass";
import theme from "@rebass/preset";
import CenteredPage from "components/CenteredPage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import ApolloClient from "apollo-boost";
import { ApolloClient } from 'apollo-client';
import{ InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from "@apollo/react-hooks";

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: process.env.REACT_APP_ENDPOINT + "/graphql",
//   request: operation => {
//     console.log(operation);
//     const token = sessionStorage.getItem("token");

//     operation.setContext({
//       headers: {
//         authorization: `Bearer ${token}`
//       }
//     });
//   }
// });
const token = sessionStorage.getItem("token")
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.REACT_APP_ENDPOINT + "/graphql",
    // fetchOptions: {
    //   mode: 'no-cors'
    // },
    headers: {
      authorization: `Bearer ${token}`
    }
  }),
  
})

function Home() {
  return (
    <CenteredPage>
      <Box>
        <Heading>Hello!</Heading>
        <Button as={Link} to='/login'>
          Login
        </Button>
      </Box>
    </CenteredPage>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AccountProvider endpoint={process.env.REACT_APP_ENDPOINT}>
        <ThemeProvider theme={theme}>
          <Router>
            <div className='wrapper'>
              <Switch>
                <Route path='/login'>
                  <Login />
                </Route>
                <Route path='/' exact>
                  <Home />
                </Route>
                <PrivateRoute path='/dashboard'>
                  <Dashboard />
                </PrivateRoute>
                <Route path='*'>404</Route>
              </Switch>
            </div>
          </Router>
        </ThemeProvider>
      </AccountProvider>
    </ApolloProvider>
  );
}

export default hot(module)(App);
