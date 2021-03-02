import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Center, Container } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
// import { useRegisterMutation, MeQuery, MeDocument } from "../generated/graphql";
// import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { useMutation } from "urql";
import { useRegisterMutation } from "../graphql/generated";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";
// import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, register] = useRegisterMutation();

  return (
    <Container height="100vh">
      <DarkModeSwitch />
      <Wrapper variant="small">
        <Formik
          initialValues={{
            email: "",
            password: "",
            verifyPassword: "",
            firstname: "",
            lastname: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            if (values.password !== values.verifyPassword) {
              alert("passwords are not the same");
              setIsSubmitting(false);
            }

            const response = await register({
              email: values.email,
              password: values.password,
              firstname: values.firstname,
              lastname: values.lastname,
            });


            // const response = await register({
            //   variables: { options: values },
            // update: (cache, { data }) => {
            //   cache.writeQuery<MeQuery>({
            //     query: MeDocument,
            //     data: {
            //       __typename: "Query",
            //       me: data?.register.user,
            //     },
            //   });
            // },
            // });
            // if (response.data?.register.errors) {
            //   setErrors(toErrorMap(response.data.register.errors));
            // } else if (response.data?.register.user) {
            //   // worked
            //   router.push("/");
            // }
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
            <Box mt={4}>
              <InputField
                name="firstname"
                placeholder="firstname"
                label="Firstname *"
                required
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="lastname"
                placeholder="lastname"
                label="Lastname *"
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
            <Box mt={4}>
              <InputField
                name="verifyPassword"
                placeholder="password"
                label="Verify password *"
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
                onClick={() => {
                  setIsSubmitting(true);
                }}
                colorScheme="teal"
              >
                register
              </Button>
            </Center>
          </Form>
        </Formik>
      </Wrapper>
    </Container>
  );
};

// export default withApollo({ ssr: false })(Register);

export default Register;
