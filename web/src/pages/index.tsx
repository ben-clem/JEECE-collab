import { Center, Heading, Text, HStack, Spacer } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { CONTAINER_HEIGHT } from "../constants";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <NavBar></NavBar>
    <MyContainer>
      <Center maxW="75vw" mx="auto" mt="35vh">
        <Heading as="h1" size="xl">
          JEECE Collab, your web platform for collaborative work.
        </Heading>
      </Center>
    </MyContainer>
  </>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
