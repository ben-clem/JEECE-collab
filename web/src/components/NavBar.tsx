import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../graphql/generated";
import theme from "../theme";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { colorMode } = useColorMode();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <HStack spacing={0}>
        <NextLink href="/login">
          <Button h={8} mr={2} backgroundColor="teal.500" color="white">
            login
          </Button>
        </NextLink>

        <NextLink href="/register">
          <Button h={8} color="teal.500">
            register
          </Button>
        </NextLink>
      </HStack>
    );
    //user is logged in
  } else {
    body = (
      <HStack>
        <Box maxH={6}>
          {data.me.admin ? (
            <Text isTruncated>Hello, {data.me.firstname}! (admin) </Text>
          ) : (
            <Text isTruncated>Hello, {data.me.firstname}!</Text>
          )}
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
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      bg={theme.colors.headerBg[colorMode]}
    >
      <Grid
        templateColumns="repeat(5, 1fr)"
        gap={2}
        height={10}
        maxW="100vw"
        align="center"
        px={2}
        py={0}
      >
        <GridItem colSpan={2} h="10" />
        <GridItem colSpan={1} h="10">
          <Flex h="10" justify="center" align="center">
            <NextLink href="/">
              <Button size="lg" variant="link" color="teal.500">
                JEECE Collab
              </Button>
            </NextLink>
          </Flex>
        </GridItem>

        <GridItem colSpan={2} h="10">
          <Flex h="10" align="center">
            <Box
              ml="auto"
              mr={2}
              pr={2}
              borderRight="1px"
              borderColor="rgba(0, 0, 0,.3)"
            >
              {body}
            </Box>
            <DarkModeSwitch />
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};
