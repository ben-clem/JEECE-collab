import { withUrqlClient } from "next-urql";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { __containerHeight__ } from "../constants";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <NavBar></NavBar>
    <Container height={__containerHeight__}></Container>
  </>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
