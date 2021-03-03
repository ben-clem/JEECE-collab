import { Flex, Box, Link, Button, HStack } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { useLogoutMutation, useMeQuery } from "../graphql/generated";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
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
    body = (
      <HStack>
        <Box>
          {data.me.firstname} {data.me.lastname}
        </Box>
        <Button
          h={8}
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </HStack>
    );
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
