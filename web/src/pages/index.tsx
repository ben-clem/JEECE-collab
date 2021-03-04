import {
  Center,
  Grid,
  GridItem,
  Heading,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { useMeQuery } from "../graphql/generated";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const { colorMode } = useColorMode();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });

  let body = null;

  // fetching: waiting
  if (fetching) {
    // logged in:
  } else if (data?.me) {
    // admin:
    if (data?.me?.admin) {
      body = (
        <Center maxW="75vw" mx="auto" mt="35vh">
          <Heading as="h1" size="xl">
            admin
          </Heading>
        </Center>
      );

      // normal user
    } else {
      body = (
        <Center maxW="95vw">
          <Grid
            h="85vh"
            w="95vw"
            mt={10}
            templateRows="repeat(5, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={3}
          >
            <GridItem
              borderRadius="xl"
              rowSpan={1}
              colSpan={1}
              bg={theme.colors.transparent[colorMode]}
            ></GridItem>
            <GridItem
              borderRadius="xl"
              rowSpan={5}
              bg={theme.colors.transparent[colorMode]}
            ></GridItem>
            <GridItem
              borderRadius="xl"
              rowSpan={4}
              bg={theme.colors.transparent[colorMode]}
            ></GridItem>
          </Grid>
        </Center>
      );
    }

    // not logged in:
  } else {
    body = (
      <Center maxW="75vw" mx="auto" mt="35vh">
        <Heading as="h1" size="xl">
          JEECE Collab, your web platform for collaborative work.
        </Heading>
      </Center>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <MyContainer>{body}</MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
