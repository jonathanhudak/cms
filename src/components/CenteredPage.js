import React from "react";
import PropTypes from "prop-types";
import { Flex } from "rebass";

export default function CenteredPage({ children }) {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='inherit'
    >
      {children}
    </Flex>
  );
}

CenteredPage.propTypes = {
  children: PropTypes.node
};
