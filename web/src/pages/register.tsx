import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { Form, Formik, useFormik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "../components/Container";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { SelectField } from "../components/SelectField";
import { Wrapper } from "../components/Wrapper";
import { __containerHeight__ } from "../constants";
import {
  usePostesQuery,
  useRegisterMutation,
  useServicesQuery,
} from "../graphql/generated";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, register] = useRegisterMutation();

  const [{ data: servicesData, fetching: servicesFetching }] = useServicesQuery({
    pause: false, // this request can be executed server-side
  });
  let servicesOptions = null;
  // data is loading
  if (servicesFetching) {
    //user is logged in
  } else {
    servicesOptions = servicesData?.services
  }

  const [{ data: postesData, fetching: postesFetching }] = usePostesQuery({
    pause: false, // this request can be executed server-side
  });
  let postesOptions = null;
  // data is loading
  if (postesFetching) {
    //user is logged in
  } else {
    postesOptions = postesData?.postes
  }

  return (
    <>
      <NavBar></NavBar>
      <Container height={__containerHeight__}>
        <Wrapper variant="small">
          <Formik
            initialValues={{
              email: "",
              password: "",
              verifyPassword: "",
              firstname: "",
              lastname: "",
              serviceId: 0,
              posteId: 0
            }}
            onSubmit={async (values, { setErrors }) => {
              console.log(values)
              setIsSubmitting(true);
              if (values.password !== values.verifyPassword) {
                setErrors(
                  toErrorMap([
                    {
                      field: "password",
                      message: "passwords are not the same",
                    },
                  ])
                );
                setIsSubmitting(false);
              } else {
                const response = await register({
                  email: values.email,
                  password: values.password,
                  firstname: values.firstname,
                  lastname: values.lastname,
                  posteId: values.posteId,
                  serviceId: values.serviceId,
                });
                if (response.data?.register.errors?.length !== 0) {
                  if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors)); // Formik hook to handle each field errors + utility function to map the errors from GraphQL
                    setIsSubmitting(false);
                  }
                } else if (response.data?.register.user) {
                  //worked
                  router.push("/");
                }
              }
            }}
          >
            <Form>
              <Box mt={12}>
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
                <SelectField
                  name="serviceId"
                  placeholder="Veuillez sélectionner votre service"
                  label="Service"
                  options={servicesOptions}
                />
              </Box>
              <Box mt={4}>
              <SelectField
                  name="posteId"
                  placeholder="Veuillez sélectionner votre poste"
                  label="Poste"
                  options={postesOptions}
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
                  colorScheme="teal"
                >
                  register
                </Button>
              </Center>
            </Form>
          </Formik>
        </Wrapper>
      </Container>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
