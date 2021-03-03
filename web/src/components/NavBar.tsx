import { Flex, Box, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { useMeQuery } from "../graphql/generated";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );

    //user is logged in
  } else {
    body = <Box>{data.me.email}</Box>;
  }

  return (
    <Flex p={4}>
      <Box
        ml={"auto"}
        mr={2}
        pr={2}
        borderRight="1px"
        borderColor="rgba(0, 0, 0,.3)"
      >
        {body}
      </Box>
      <DarkModeSwitch />
    </Flex>
  );
};
