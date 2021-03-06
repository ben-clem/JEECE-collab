import {
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { SearchField } from "../components/SearchField";
import { UserInfo } from "../components/UserInfo";
import {
  useMeQuery,
  useUsersByFirstnameOrLastnameQuery,
} from "../graphql/generated";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const { colorMode } = useColorMode();
  const [meResult, executeMeQuery] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [string, setString] = useState("");

  const [
    usersByFirstnameOrLastnameResult,
    executeUsersByFirstnameOrLastnameQuery,
  ] = useUsersByFirstnameOrLastnameQuery({
    variables: {
      name: currentWord,
    },
    pause: false, // this query can be done server-side
  });

  if (usersByFirstnameOrLastnameResult.fetching) {
    // waiting
    console.log("--fetching")
  } else if (usersByFirstnameOrLastnameResult.data) {
    // users.push(
    //   usersByFirstnameOrLastnameResult.data
    //     .usersByFirstnameOrLastname
    // );
    console.log("--users:")
    console.log(
      usersByFirstnameOrLastnameResult.data.usersByFirstnameOrLastname
    );
  }

  let body = null;

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
                onSubmit={async (values, { setErrors }) => {
                  setIsSubmitting(true);

                  console.log(values.input);
                  setString(values.input);

                  //console.log(users);

                  //const response = await search(values.input);
                  // if (response.data?.register.errors?.length !== 0) {
                  //   if (response.data?.register.errors) {
                  //     setErrors(toErrorMap(response.data.register.errors)); // Formik hook to handle each field errors + utility function to map the errors from GraphQL
                  //     setIsSubmitting(false);
                  //   }
                  // } else if (response.data?.register.user) {
                  //   //worked
                  //   router.push("/");

                  //}
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
              <UserInfo />
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
