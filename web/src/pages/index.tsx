import { Center, Heading, Text, HStack, Spacer } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { __containerHeight__ } from "../constants";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <NavBar></NavBar>
    <Container height={__containerHeight__} maxW="100vw">
      <Center maxW="75vw" mx="auto" mt="35vh">
        <Heading as="h1" size="xl">
          JEECE Collab, your web platform for collaborative work.
        </Heading>
      </Center>
    </Container>
  </>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
