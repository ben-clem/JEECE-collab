import { Box, Button, Center, Container } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../graphql/generated";
import { toErrorMap } from "../utils/toErrorMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, login] = useLoginMutation();

  return (
    <>
      <NavBar></NavBar>
      <Container height="100vh">
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
              <Box mt={16}>
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
      </Container>
    </>
  );
};

export default Login;
