import { ChatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
  Flex,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../components/Container";
import { MeInfo } from "../components/MeInfo";
import { NavBar } from "../components/NavBar";
import { SearchField } from "../components/SearchField";
import { UserInfoBar } from "../components/UserInfoBar";
import { UserInfoCard } from "../components/UserInfoCard";
import {
  Conversation,
  ConvToUser,
  Maybe,
  useConversationsByUserIdQuery,
  useConversationWithUserIdsQuery,
  useCreateConversationWithUserIdsMutation,
  useMeQuery,
  useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery,
} from "../graphql/generated";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [string, setString] = useState("");
  const [id1, setId1] = useState<number>(0);
  const [id2, setId2] = useState<number>(0);
  const [isSwitching, setIsSwitching] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [
    ,
    createConversationWithUserIds,
  ] = useCreateConversationWithUserIdsMutation();

  const [myId, setMyId] = useState<number>(0);
  const [meResult, reexecuteMeQuery] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });
  useEffect(() => {
    if (meResult.data?.me?.id) {
      setMyId(meResult.data?.me?.id);
    }
  }, [meResult]);

  const [usersResult] = useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery({
    variables: {
      string,
    },
    pause: false, // this query can be done server-side
  });
  const [
    conversationResult,
    reexecuteConvQuery,
  ] = useConversationWithUserIdsQuery({
    variables: {
      id1,
      id2,
    },
    pause: false, // this query can be done server-side
  });

  useEffect(() => {
    if (isSubmitting && !usersResult.fetching) {
      onOpen();
      setIsSubmitting(false);
    }
  }, [isSubmitting, usersResult]);

  useEffect(() => {
    if (isSwitching && !conversationResult.fetching) {
      console.log("entering");
      console.log(conversationResult);

      if (conversationResult.data?.conversationWithUserIds.conv) {
        console.log("found convo:");
        console.log(conversationResult.data);
        router.push({
          pathname: "/conversation/[uuid]",
          query: {
            uuid: conversationResult.data?.conversationWithUserIds.conv?.uuid,
          },
        });

        setIsSwitching(false);
      } else {
        // creating the inexisting convo
        console.log("no convo, creating one");

        const creatingConvo = async () => {
          await createConversationWithUserIds({
            id1,
            id2,
          });
        };
        creatingConvo();
        reexecuteConvQuery({ requestPolicy: "network-only" });
      }
    }
  }, [isSwitching, conversationResult]);

  const [convs, setConvs] = useState<
    Maybe<
      Array<
        { __typename?: "Conversation" } & Pick<
          Conversation,
          "uuid" | "createdAt" | "updatedAt"
        > & {
            convToUsers: Array<
              { __typename?: "ConvToUser" } & Pick<
                ConvToUser,
                "userId" | "active"
              >
            >;
          }
      >
    >
  >([]);
  const [convsResult] = useConversationsByUserIdQuery({
    variables: {
      id: myId,
    },
    pause: false, // this query can be done server-side
  });
  useEffect(() => {
    if (convsResult.data?.conversationsByUserId.convs) {
      setConvs(convsResult.data?.conversationsByUserId.convs);
    }
  }, [convsResult]);

  let body = null;
  let modal = null;

  if (usersResult.fetching) {
    // waiting
  } else if (usersResult.error) {
  } else if (usersResult.data?.usersByFnOrLnOrSnOrPnLikeWordsInString) {
    // got users result array
    // worked, need to diplay them + button to start convo (opening via useEffect hook)

    // need to display users if result full or message if no results
    if (usersResult.data.usersByFnOrLnOrSnOrPnLikeWordsInString?.length === 0) {
      modal = (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Résultat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Aucun utilisateur ne correspond à votre recherche...</p>
            </ModalBody>

            <ModalFooter />
          </ModalContent>
        </Modal>
      );
    } else {
      modal = (
        <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Résultat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Wrap justify="center" spacing={4}>
                {usersResult.data.usersByFnOrLnOrSnOrPnLikeWordsInString.map(
                  (user) => {
                    return (
                      <WrapItem
                        key={user.id}
                        bg={theme.colors.transparent[colorMode]}
                        borderRadius="lg"
                      >
                        <VStack w="22rem" h="13rem" spacing={0}>
                          <UserInfoCard id={user.id} />
                          <Button
                            w="100%"
                            onClick={() => {
                              if (!meResult.fetching && meResult.data?.me) {
                                setId1(meResult.data?.me?.id);
                              }
                              setId2(user.id);
                              setIsSwitching(true);
                            }}
                          >
                            <ChatIcon />
                          </Button>
                        </VStack>
                      </WrapItem>
                    );
                  }
                )}
              </Wrap>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      );
    }
  }

  // fetching: waiting
  if (meResult.fetching) {
    // logged in:
  } else if (meResult.data?.me) {
    // admin:
    if (meResult.data?.me?.admin) {
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
          {modal}
          <Grid
            h="85vh"
            w="95vw"
            mt={6}
            templateRows="repeat(12, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={3}
          >
            <GridItem borderRadius="xl" colSpan={2} rowSpan={1}>
              <Formik
                initialValues={{
                  input: "",
                }}
                onSubmit={async (values) => {
                  setIsSubmitting(true);
                  setString(values.input);
                }}
              >
                <HStack boxSize="100%" align="center" justify="center">
                  <Form style={{ width: "98%", height: "98%", margin: "auto" }}>
                    <SearchField
                      name="input"
                      placeholder="rechercher un utilisateur par nom, prénom, poste ou service... (plusieurs mots ? : les séparer d'un espace)"
                      isLoading={isSubmitting}
                    ></SearchField>
                  </Form>
                </HStack>
              </Formik>
            </GridItem>
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={3}
              bg={theme.colors.transparent[colorMode]}
            >
              <MeInfo />
            </GridItem>
            {/* Conversations */}
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={11}
              bg={theme.colors.transparent[colorMode]}
            >
              {/* router.push({
            pathname: "/conversation/[uuid]",
            query: {
              uuid: conv.uuid,
            },
          }); */}

              <VStack spacing={2}>
                {console.log(convs)}
                {convs
                  ? convs.map((conv) => {
                      return (
                        <Flex
                          w="98%"
                          h="3rem"
                          align="center"
                          justify="left"
                          mt={2}
                          borderRadius="lg"
                          bg={theme.colors.tealTrans[colorMode]}
                          key={conv.uuid}
                        >
                          <LinkBox>
                            <LinkOverlay href={`/conversation/${conv.uuid}`}>
                              {conv.convToUsers[0].userId === myId ? (
                                <UserInfoBar id={conv.convToUsers[1].userId} />
                              ) : (
                                <UserInfoBar id={conv.convToUsers[0].userId} />
                              )}
                            </LinkOverlay>
                          </LinkBox>
                        </Flex>
                      );
                    })
                  : null}
              </VStack>
            </GridItem>
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={8}
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
