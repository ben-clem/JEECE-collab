import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MyContainer } from "../components/Container";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { CONTAINER_HEIGHT } from "../constants";
import { useLoginMutation } from "../graphql/generated";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, login] = useLoginMutation();

  return (
    <>
      <NavBar></NavBar>
      <MyContainer>
        <Heading mt={8} as="h1" size="lg">
          Login
        </Heading>
        <Wrapper variant="small">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={async (values, { setErrors }) => {
              setIsSubmitting(true);
              const response = await login(values);
              console.log(response);
              if (response.data?.login.errors?.length !== 0) {
                if (response.data?.login.errors) {
                  setErrors(toErrorMap(response.data.login.errors)); // Formik hook to handle each field errors + utility function to map the errors from GraphQL
                  setIsSubmitting(false);
                }
              } else if (response.data?.login.user) {
                //worked
                router.push("/");
              }
            }}
          >
            <Form>
              <Box mt={0}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email *"
                  required
                />
              </Box>

              <Box mt={8}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password *"
                  type="password"
                  required
                  showButton
                />
              </Box>

              <Center>
                <Button
                  m={12}
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  login
                </Button>
              </Center>
            </Form>
          </Formik>
        </Wrapper>
      </MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
