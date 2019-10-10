// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAccount } from "@jmhudak/strapi-auth";

export default function PrivateRoute({ children, ...rest }) {
  const { isLoggedIn } = useAccount();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
