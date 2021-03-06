import {
  Avatar,
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  usePosteByIdQuery,
  useServiceByIdQuery,
  useUserByIdQuery,
} from "../graphql/generated";
import theme from "../theme";

type UserInfoProps = {
  id: number;
};

export const UserInfo = (props: UserInfoProps) => {
  const { colorMode } = useColorMode();
  const [serviceId, setServiceId] = useState(0);
  const [posteId, setPosteId] = useState(0);

  const [{ data: userData, fetching: userFetching }] = useUserByIdQuery({
    variables: {
      id: props.id,
    },
    pause: false, // this request can be done server-side
  });

  const [
    { data: serviceByIdData, fetching: serviceByIdFetching },
  ] = useServiceByIdQuery({
    variables: {
      id: serviceId,
    },
    pause: false, // this request can be done server-side
  });

  const [
    { data: posteByIdData, fetching: posteByIdFetching },
  ] = usePosteByIdQuery({
    variables: {
      id: posteId,
    },
    pause: false, // this request can be done server-side
  });

  let body = null;

  if (userFetching) {
    // fetching: waiting
  } else if (userData?.userById) {
    // logged in:
    if (userData.userById.serviceId && serviceId === 0) {
      setServiceId(userData.userById.serviceId);
    }
    if (userData.userById.posteId && posteId === 0) {
      setPosteId(userData.userById.posteId);
    }

    body = (
      <Grid
        boxSize="100%"
        templateColumns="repeat(8, 1fr)"
        templateRows="repeat(4, 1fr)"
      >
        <GridItem colSpan={1} rowSpan={2}>
          <Center boxSize="100%">
            <Avatar boxSize="4vw"></Avatar>
          </Center>
        </GridItem>
        <GridItem colSpan={7} rowSpan={1}>
          <HStack boxSize="100%" ml={2}>
            <Box>
              {userData.userById.firstname} {userData.userById.lastname}
            </Box>
          </HStack>
        </GridItem>
        <GridItem colSpan={7} rowSpan={1}>
          <HStack boxSize="100%" ml={2}>
            <Box>{userData.userById.email}</Box>
          </HStack>
        </GridItem>
        <GridItem colSpan={4} rowSpan={2}>
          <VStack boxSize="100%" ml={2} align="left" justify="center">
            <Box>
              Service :{" "}
              {serviceByIdFetching ? (
                <Spinner size="xs" />
              ) : (
                serviceByIdData?.serviceById?.name
              )}
            </Box>
            <Box>
              Poste :{" "}
              {posteByIdFetching ? (
                <Spinner size="xs" />
              ) : (
                posteByIdData?.posteById?.name
              )}
            </Box>
          </VStack>
        </GridItem>
        <GridItem colSpan={4} rowSpan={2}>
          <VStack boxSize="100%" mr={2} align="right" justify="center">
            <HStack align="right" justify="right">
              <Text>Accepted ?</Text>
              <Text
                color={
                  userData.userById.accepted
                    ? theme.colors.teal[500]
                    : theme.colors.red[500]
                }
              >
                {userData.userById.accepted.toString()}
              </Text>
            </HStack>
            <HStack align="right" justify="right">
              <Text>Admin ?</Text>
              <Text
                color={
                  userData.userById.admin
                    ? theme.colors.teal[500]
                    : theme.colors.gray[500]
                }
              >
                {userData.userById.admin.toString()}
              </Text>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    );

    // not logged in:
  } else {
    body = (
      <Center>
        <Heading as="h4">Need userId</Heading>
      </Center>
    );
  }

  return (
    <Center boxSize="100%">
      <Box w="96%" h="85%">
        {body}
      </Box>
    </Center>
  );
};
