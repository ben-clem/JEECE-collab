import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { MyContainer } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetConversationFromUrl } from "../../utils/useGetConversationFromUrl";

const Conversation = ({}) => {
  const [{ fetching, error, data }] = useGetConversationFromUrl();

  // console.log("fetching");
  // console.log(fetching);
  // console.log("error");
  // console.log(error);
  // console.log("data");
  // console.log(data);

  let body = null;

  if (fetching) {
    body = <Spinner size="xl" />;
  } else if (error || data?.conversationByUuid.error) {
    body = (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {error ? error.name : null}
        </AlertTitle>
        <AlertDescription>
          {error ? error.message : data?.conversationByUuid.error}
        </AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  } else if (data?.conversationByUuid) {
    body = (
      <>
        <Heading mb={4}>{data.conversationByUuid.conv?.uuid}</Heading>
      </>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <MyContainer>{body}</MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Conversation);
