import React from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Login, useAccount } from "@jmhudak/strapi-auth";
import { Button, Box, Heading } from "rebass";
import styled from "@emotion/styled";
import CenteredPage from "components/CenteredPage";

import { Label as BaseLabel, Input } from "@rebass/forms";

const Label = styled(BaseLabel)`
  display: block;
`;

Label.defaultProps = {
  mb: 2
};

export default function LoginScreen() {
  const { isLoggedIn } = useAccount();
  const history = useHistory();
  const location = useLocation();

  const { from } =
    location.state && location.state.from.pathname === "/"
      ? { from: { pathname: "/dashboard" } }
      : location.state || {};
  const onLogin = () => history.replace(from);

  if (isLoggedIn) {
    return (
      <Redirect
        to={{
          pathname: "/dashboard"
        }}
      />
    );
  }

  return (
    <CenteredPage>
      <Box>
        <Heading>Please login</Heading>
        <Login Label={Label} Input={Input} Button={Button} onLogin={onLogin} />
      </Box>
    </CenteredPage>
  );
}
