import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  Grid,
  GridItem,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  useColorMode,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import {
  useAddMessageMutation,
  useMessagesQuery,
  Conversation,
  Message,
  User,
  Service,
  Poste,
} from "../../graphql/generated";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetConversationFromUrl } from "../../utils/useGetConversationFromUrl";

const ConversationPage = ({}) => {
  const { colorMode } = useColorMode();
  const moment = require("moment");

  // getting the conv uuid
  const [convUuid, setConvUuid] = useState<string>("");
  const [getConversationResult] = useGetConversationFromUrl();
  useEffect(() => {
    if (getConversationResult.data?.conversationByUuid.conv?.uuid) {
      setConvUuid(getConversationResult.data?.conversationByUuid.conv?.uuid);
    }
  }, [getConversationResult]);

  // getting the messages
  const [messages, setMessages] = useState<
    Array<
      { __typename?: "Message" } & Pick<
        Message,
        "uuid" | "content" | "createdAt" | "updatedAt"
      > & {
          user: { __typename?: "User" } & Pick<
            User,
            "id" | "email" | "firstname" | "lastname" | "profilePicPath"
          > & {
              service: { __typename?: "Service" } & Pick<Service, "name">;
              poste: { __typename?: "Poste" } & Pick<Poste, "name">;
            };
        }
    >
  >([]);
  const [messagesResult] = useMessagesQuery({
    variables: {
      convUuid,
    },
    pause: false, // this query can be done server-side
  });
  useEffect(() => {
    if (messagesResult.data?.messages) {
      setMessages(messagesResult.data?.messages);
    }
  }, [messagesResult]);

  const [newMessage, setNewMessage] = useState<string>();

  const [, addMessage] = useAddMessageMutation();

  // console.log("fetching");
  // console.log(fetching);
  // console.log("error");
  // console.log(error);
  // console.log("data");
  // console.log(data);

  let body = null;

  if (getConversationResult.fetching) {
    body = (
      <Center>
        <Spinner size="xl" />;
      </Center>
    );
  } else if (
    getConversationResult.error ||
    getConversationResult.data?.conversationByUuid.error
  ) {
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
          {getConversationResult.error
            ? getConversationResult.error.name
            : null}
        </AlertTitle>
        <AlertDescription>
          {getConversationResult.error
            ? getConversationResult.error.message
            : getConversationResult.data?.conversationByUuid.error}
        </AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  } else if (getConversationResult.data?.conversationByUuid) {
    body = (
      <>
        <Center maxW="90vw">
          <Grid
            h="90vh"
            w="80vw"
            mt={5}
            templateRows="repeat(10, 1fr)"
            templateColumns="repeat(1, 1fr)"
            gap={3}
          >
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={9}
              bg={theme.colors.transparent[colorMode]}
            >
              {messages.map((message) => {
                return (
                  <Box w="100%" p={3} color={theme.colors.content[colorMode]}>
                    <HStack>
                      <Avatar size="xs" />
                      <Text
                        fontSize="md"
                        borderBottom="1px"
                        borderColor="teal.700"
                      >
                        {message.user.firstname} {message.user.firstname}
                      </Text>
                      <Text as="i" fontSize="sm" color={theme.colors.contentTrans[colorMode]}>
                        {moment(message.createdAt).fromNow()}
                      </Text>
                    </HStack>

                    <Text fontSize="md">{message.content}</Text>
                  </Box>
                );
              })}
            </GridItem>
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={1}
              bg={theme.colors.transparent[colorMode]}
            >
              <Formik
                initialValues={{
                  message: "",
                }}
                onSubmit={(values) => {
                  setNewMessage(values.message);
                }}
              >
                <Form style={{ width: "100%", height: "100%", margin: "auto" }}>
                  <Center boxSize="100%">
                    <InputGroup w="99.1%" h="85%">
                      <Input
                        boxSize="100%"
                        borderWidth={2}
                        borderColor="teal.600"
                      ></Input>
                      <InputRightElement h="100%" width="5.1rem" mr={1}>
                        <Button
                          size="md"
                          w="5rem"
                          type="submit"
                          colorScheme="teal"
                        >
                          send
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Center>
                </Form>
              </Formik>
            </GridItem>
          </Grid>
        </Center>
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

export default withUrqlClient(createUrqlClient, { ssr: true })(
  ConversationPage
);
