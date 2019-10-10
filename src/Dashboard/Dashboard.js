import React from "react";
import { useAccount } from "@jmhudak/strapi-auth";
import { Flex, Text, Button } from "rebass";
import { useHistory } from "react-router";

function AccountInfo() {
  const { account, logout } = useAccount();
  const history = useHistory();

  const onLogout = () => {
    logout(() => history.push("/"));
  };

  return (
    <Flex py={2} alignItems='center' justifyContent='flex-end'>
      <Text mr={2}>Hello {account.user.username}!</Text>
      <Button onClick={onLogout} variant='outline'>
        Logout
      </Button>
    </Flex>
  );
}

export default function Dashboard() {
  return (
    <div>
      <AccountInfo />
      <h1>Hello CMS!</h1>
    </div>
  );
}
