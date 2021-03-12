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
  FormControl,
} from "@chakra-ui/react";
import { Form, Formik, FormikProps, useField } from "formik";
import { withUrqlClient } from "next-urql";
import React, { InputHTMLAttributes, useEffect, useState } from "react";
import { MyContainer } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import { SearchField } from "../../components/SearchField";
import {
  useAddMessageMutation,
  useMessagesQuery,
  Conversation,
  Message,
  User,
  Service,
  Poste,
  useMeQuery,
} from "../../graphql/generated";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { isServer } from "../../utils/isServer";
import { useGetConversationFromUrl } from "../../utils/useGetConversationFromUrl";

const ConversationPage = ({}) => {
  const { colorMode } = useColorMode();
  const moment = require("moment");

  const [meResult, reexecuteMeQuery] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });

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

  const [newMessage, setNewMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, addMessage] = useAddMessageMutation();
  useEffect(() => {
    console.log(newMessage);
    if (
      submitting &&
      newMessage &&
      newMessage !== "" &&
      meResult.data?.me?.id !== undefined
    ) {
      const addingMessage = async () => {
        await addMessage({
          convUuid,
          message: newMessage,
          userId: meResult.data?.me?.id as number,
        });
      };
      addingMessage();
      setSubmitting(false);
    }
  }, [newMessage, submitting]);

  type newMessageProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
  };

  const NewMessageField: React.FC<newMessageProps> = ({ ...props }) => {
    const [field] = useField(props.name);
    return (
      <InputGroup w="99.1%" h="85%">
        <Input
          {...field}
          boxSize="100%"
          borderWidth={2}
          borderColor="teal.600"
          id="newMessage"
          placeholder="message"
        ></Input>
        <InputRightElement h="100%" width="5.1rem" mr={1}>
          <Button size="md" w="5rem" type="submit" colorScheme="teal">
            send
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  };

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
            minH="90vh"
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
              {messages.length === 0 ? (
                <Center minH="90%" m="auto">
                  <Text
                    fontSize="md"
                    color={theme.colors.contentTrans[colorMode]}
                  >
                    Send the first message...
                  </Text>
                </Center>
              ) : (
                messages.slice(0).reverse().map((message) => {
                  return (
                    <Box key={message.uuid} w="100%" p={3} color={theme.colors.content[colorMode]}>
                      <HStack>
                        <Avatar size="xs" />
                        <Text
                          fontSize="md"
                          borderBottom="1px"
                          borderColor="teal.700"
                        >
                          {message.user.firstname} {message.user.firstname}
                        </Text>
                        <Text
                          as="i"
                          fontSize="sm"
                          color={theme.colors.contentTrans[colorMode]}
                        >
                          {moment(message.createdAt).fromNow()}
                        </Text>
                      </HStack>

                      <Text fontSize="md">{message.content}</Text>
                    </Box>
                  );
                })
              )}
            </GridItem>
            <GridItem
            maxH="8vh"
              borderRadius="xl"
              colSpan={1}
              rowSpan={1}
              bg={theme.colors.transparent[colorMode]}
            >
              <Formik
                initialValues={{
                  newMessage: "",
                }}
                onSubmit={(values, {resetForm}) => {
                  setNewMessage(values.newMessage);
                  setSubmitting(true);
                  resetForm({})
                }}
              >
                <Form style={{ width: "100%", height: "100%", margin: "auto" }}>
                  <Center boxSize="100%">
                    <NewMessageField name="newMessage" type="text" />
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
