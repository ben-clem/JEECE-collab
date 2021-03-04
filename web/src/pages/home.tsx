import { Center, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { CONTAINER_HEIGHT } from "../constants";
import { createUrqlClient } from "../utils/createUrqlClient";

interface homeProps {}

export const Home: React.FC<homeProps> = ({}) => {
  return (
    <>
      <NavBar></NavBar>
      <Container height={CONTAINER_HEIGHT} maxW="100vw">
        
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
