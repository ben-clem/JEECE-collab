import {
  AttachmentIcon,
  ChatIcon,
  CloseIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../components/Container";
import { DocumentsUploader } from "../components/DocumentsUploader";
import { MeInfo } from "../components/MeInfo";
import { NavBar } from "../components/NavBar";
import { NewUsersManager } from "../components/NewUsersManager";
import { SearchField } from "../components/SearchField";
import { UserInfoBar } from "../components/UserInfoBar";
import { UserInfoCard } from "../components/UserInfoCard";
import {
  Conversation,
  ConvToUser,
  Document,
  Maybe,
  useConversationsByUserIdQuery,
  useConversationWithUserIdsQuery,
  useCreateConversationWithUserIdsMutation,
  useDocumentsByUserIdQuery,
  useMeQuery,
  User,
  useUpdateConvToUserMutation,
  useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery,
} from "../graphql/generated";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const moment = require("moment");

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

  const [retried, setRetried] = useState<boolean>(false);

  useEffect(() => {
    if (!meResult.data?.me && !retried) {
      reexecuteMeQuery({ requestPolicy: "network-only" });
      setRetried(true);
    }
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
      if (conversationResult.data?.conversationWithUserIds.conv) {
        router.push({
          pathname: "/conversation/[uuid]",
          query: {
            uuid: conversationResult.data?.conversationWithUserIds.conv?.uuid,
          },
        });

        setIsSwitching(false);
      } else {
        // creating the inexisting convo

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
              { __typename?: "ConvToUser" } & Pick<ConvToUser, "active"> & {
                  user: { __typename?: "User" } & Pick<
                    User,
                    "id" | "email" | "firstname" | "lastname"
                  >;
                }
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
      setConvs(
        convsResult.data?.conversationsByUserId.convs
          .slice()
          .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      );
    }
  }, [convsResult]);

  // turning conv inactive on click
  const [deletingConv, setDeletingConv] = useState<boolean>(false);
  const [convToDelete, setConvToDelete] = useState<string>("");
  const [, updateConvToUser] = useUpdateConvToUserMutation();
  useEffect(() => {
    if (deletingConv && convToDelete !== "") {
      const updatingConvToUser = async () => {
        await updateConvToUser({
          convUuid: convToDelete,
          userId: myId,
          active: false,
        });
      };
      updatingConvToUser();

      if (convs) {
        setConvs(
          convs
            ?.filter(
              (conv) =>
                (conv.convToUsers[0].user.id === myId &&
                  conv.convToUsers[0].active) ||
                (conv.convToUsers[1].user.id === myId &&
                  conv.convToUsers[1].active)
            )
            .slice()
            .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
        );
      }

      setDeletingConv(false);
      setConvToDelete("");
    }
  }, [deletingConv]);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsResult] = useDocumentsByUserIdQuery({
    variables: {
      id: myId,
    },
    pause: false, // this query can be done server-side
  });
  useEffect(() => {
    if (
      !documentsResult.fetching &&
      !documentsResult.error &&
      documentsResult.data &&
      documentsResult.data.documentsByUserId.length !== 0
    ) {
      setDocuments(
        documentsResult.data.documentsByUserId
          .slice()
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      );
    }
  }, [documentsResult]);

  const [sortingDocs, setSortingDocs] = useState<string>("date");
  useEffect(() => {
    if (sortingDocs === "date") {
      setDocuments(
        documents
          .slice()
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      );
    } else if (sortingDocs === "alphabetically") {
      setDocuments(
        documents.slice().sort((a, b) => (a.name > b.name ? 1 : -1))
      );
    }
  }, [sortingDocs]);

  const [sortingConvs, setSortingConvs] = useState<string>("date");
  useEffect(() => {
    if (sortingConvs === "date" && convs !== null) {
      setConvs(
        convs
          .slice()
          .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      );
    } else if (sortingConvs === "alphabetically" && convs !== null) {
      setConvs(
        convs
          .slice()
          .sort((a, b) =>
            myId === a.convToUsers[0].user.id
              ? a.convToUsers[1].user.firstname >
                b.convToUsers[1].user.firstname
                ? 1
                : -1
              : a.convToUsers[0].user.firstname >
                b.convToUsers[0].user.firstname
              ? 1
              : -1
          )
      );
    }
  }, [sortingConvs]);

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
        <>
          <Heading as="h1" size="xl" mt={5}>
            Admin panel
          </Heading>
          <Center maxW="95vw">
            <Grid
              h="80vh"
              w="95vw"
              mt={6}
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(2, 1fr)"
              gap={3}
            >
              <GridItem
                borderRadius="xl"
                colSpan={1}
                rowSpan={1}
                align="center"
                bg={theme.colors.transparent[colorMode]}
              >
                <DocumentsUploader />
              </GridItem>
              <GridItem
                borderRadius="xl"
                colSpan={1}
                rowSpan={1}
                align="center"
                bg={theme.colors.transparent[colorMode]}
              >
                <NewUsersManager />
              </GridItem>
            </Grid>
          </Center>
        </>
      );
    } else if (meResult.data?.me?.accepted === null) {
      // not accepted yet
      body = (
        <>
          <Heading as="h2" size="md" mt="30vh">
            You have not been accepted yet.
          </Heading>{" "}
          <Heading as="h2" size="sm" mt={5}>
            Please wait while our administrators are reviewing your account.
          </Heading>
        </>
      );
    } else if (!meResult.data?.me?.accepted) {
      // normal user (refused)
      body = (
        <>
          <Heading as="h2" size="md" mt="30vh">
            Your account creation has been refused.
          </Heading>{" "}
          <Heading as="h2" size="sm" mt={5}>
            Please contact our administrators if you think this is a mistake.
          </Heading>
        </>
      );

      // normal user (accepted)
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
              align="center"
              bg={theme.colors.transparent[colorMode]}
            >
              <Heading as="h2" size="md" mt={2}>
                Mes conversations
              </Heading>
              {convs?.length === 0 ? (
                <Center blockSize="35%">
                  <Stack spacing={0}>
                    <Text
                      fontSize="sm"
                      color={theme.colors.contentTrans[colorMode]}
                    >
                      Aucune conversation pour le moment...
                    </Text>
                    <Text
                      fontSize="sm"
                      color={theme.colors.contentTrans[colorMode]}
                    >
                      Commencez en une nouvelle avec la barre de recherche.
                    </Text>
                  </Stack>
                </Center>
              ) : (
                <>
                  <HStack mx={5} spacing={1} align="center">
                    <Text fontSize="sm">sort:</Text>
                    <Select
                      mt={2}
                      w="9rem"
                      size="sm"
                      onChange={(e) => {
                        setSortingConvs(e.target.value);
                      }}
                    >
                      <option value="date">date</option>
                      <option value="alphabetically">alphabetically</option>
                    </Select>
                  </HStack>
                  <VStack spacing={2}>
                    {convs
                      ? convs.map((conv) => {
                          if (
                            (conv.convToUsers[0].user.id === myId &&
                              conv.convToUsers[0].active) ||
                            (conv.convToUsers[1].user.id === myId &&
                              conv.convToUsers[1].active)
                          ) {
                            return (
                              <Flex
                                w="98%"
                                h="3rem"
                                align="center"
                                justify="space-between"
                                mt={2}
                                borderRadius="lg"
                                bg={theme.colors.tealTrans[colorMode]}
                                key={conv.uuid}
                              >
                                <LinkBox>
                                  <LinkOverlay
                                    href={`/conversation/${conv.uuid}`}
                                  >
                                    {conv.convToUsers[0].user.id === myId ? (
                                      <UserInfoBar
                                        id={conv.convToUsers[1].user.id}
                                      />
                                    ) : (
                                      <UserInfoBar
                                        id={conv.convToUsers[0].user.id}
                                      />
                                    )}
                                  </LinkOverlay>
                                </LinkBox>
                                <IconButton
                                  size="xs"
                                  mr={2}
                                  colorScheme="red"
                                  aria-label="close"
                                  icon={<CloseIcon />}
                                  onClick={() => {
                                    setDeletingConv(true);
                                    setConvToDelete(conv.uuid);
                                  }}
                                />
                              </Flex>
                            );
                          }
                        })
                      : null}
                  </VStack>
                </>
              )}
            </GridItem>

            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={8}
              align="center"
              bg={theme.colors.transparent[colorMode]}
            >
              <Heading as="h2" size="md" mt={2}>
                Mes documents
              </Heading>
              <HStack mx={5} spacing={1} align="center">
                <Text fontSize="sm">sort:</Text>
                <Select
                  mt={2}
                  w="9rem"
                  size="sm"
                  onChange={(e) => {
                    setSortingDocs(e.target.value);
                  }}
                >
                  <option value="date">date</option>
                  <option value="alphabetically">alphabetically</option>
                </Select>
              </HStack>
              <Wrap m={3} spacing={3} justify="center">
                {documents.map((document) => {
                  return (
                    <LinkBox key={document.id}>
                      <LinkOverlay
                        href={`http://localhost:4000/api/documents?path=${document.filePath}&name=${document.name}`}
                      >
                        <WrapItem
                          minW="10rem"
                          maxW="12rem"
                          p={2}
                          border="1px"
                          borderRadius="md"
                        >
                          <VStack minW="100%" maxW="100%" spacing={1}>
                            <Text minW="100%" maxW="100%" isTruncated>
                              {document.name}
                            </Text>
                            <AttachmentIcon boxSize="3em" />
                            <HStack
                              boxSize="100%"
                              align="end"
                              justify="space-between"
                            >
                              <Text as="i" fontSize="md">
                                {moment(document.createdAt).fromNow()}
                              </Text>
                              <IconButton
                                size="sm"
                                aria-label="see doc"
                                icon={
                                  <ExternalLinkIcon
                                    boxSize="1.5em"
                                    color={theme.colors.teal[500]}
                                  />
                                }
                              />
                            </HStack>
                          </VStack>
                        </WrapItem>
                      </LinkOverlay>
                    </LinkBox>
                  );
                })}
              </Wrap>
            </GridItem>
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
