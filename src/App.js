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
  );
}

export default hot(module)(App);
