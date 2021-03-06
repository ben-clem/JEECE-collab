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

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const { colorMode } = useColorMode();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [string, setString] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [meResult] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });
  const [
    usersByFnOrLnOrSnOrPnLikeWordsInStringQueryResults,
  ] = useUsersByFnOrLnOrSnOrPnLikeWordsInStringQuery({
    variables: {
      string,
    },
    pause: false, // this query can be done server-side
  });

  useEffect(() => {
    if ((isSubmitting === true)) {
      onOpen();
      setIsSubmitting(false)
    }
  }, [usersByFnOrLnOrSnOrPnLikeWordsInStringQueryResults.data, isSubmitting]);

  let body = null;
  let modal = null;

  if (usersByFnOrLnOrSnOrPnLikeWordsInStringQueryResults.fetching) {
    // waiting
  } else if (usersByFnOrLnOrSnOrPnLikeWordsInStringQueryResults.error) {
  } else if (usersByFnOrLnOrSnOrPnLikeWordsInStringQueryResults.data) {
    // got users result array
    // worked, need to diplay them + button to start convo (opening via useEffect hook)

    // need to display users if result full or message if no results

    modal = (
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Résultat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>oui modal</p>
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>
    );
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
            <GridItem
              borderRadius="xl"
              colSpan={2}
              rowSpan={1}
              bg={theme.colors.transparent[colorMode]}
            >
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
                  <Form
                    style={{ width: "99.2%", height: "80%", margin: "auto" }}
                  >
                    <SearchField
                      name="input"
                      placeholder="rechercher un autre utilisateur par nom, prénom, poste ou service..."
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
