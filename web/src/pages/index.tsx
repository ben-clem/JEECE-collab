import {
  Center,
  Grid,
  GridItem,
  Button,
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
  useDisclosure,
  WrapItem,
  Wrap,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { SearchField } from "../components/SearchField";
import { MeInfo } from "../components/MeInfo";
import {
  useMeQuery,
  useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery,
} from "../graphql/generated";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { UserInfo } from "../components/UserInfo";
import { ChatIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [string, setString] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [meResult] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });
  const [usersResult] = useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery({
    variables: {
      string,
    },
    pause: false, // this query can be done server-side
  });

  useEffect(() => {
    if (isSubmitting && !usersResult.fetching) {
      onOpen();
      setIsSubmitting(false);
    }
  }, [isSubmitting, usersResult]);

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
                    if (user.id !== meResult.data?.me?.id)
                      return (
                        <WrapItem
                          bg={theme.colors.transparent[colorMode]}
                          borderRadius="lg"
                        >
                          <VStack w="22rem" h="13rem" spacing={0}>
                            <UserInfo id={user.id} />
                            <Button w="100%" onClick={() => {

                              

                              router.push("/convo");
                            }}>
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
            <GridItem
              borderRadius="xl"
              colSpan={1}
              rowSpan={11}
              bg={theme.colors.transparent[colorMode]}
            ></GridItem>
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
