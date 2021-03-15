import { withUrqlClient } from "next-urql";
import React from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ConversationProps {}

const Conversation: React.FC<ConversationProps> = ({}) => {
  return (
    <>
      <NavBar></NavBar>
      <MyContainer></MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Conversation);
