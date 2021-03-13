import {
  Avatar,
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useUserByIdQuery } from "../graphql/generated";
import theme from "../theme";

type UserInfoCardProps = {
  id: number;
};

export const UserInfoCard = (props: UserInfoCardProps) => {
  const { colorMode } = useColorMode();

  const [{ data, fetching }] = useUserByIdQuery({
    variables: {
      id: props.id,
    },
    pause: false, // this request can be done server-side
  });

  let body = null;

  if (fetching) {
    // fetching: waiting
  } else if (data?.userById) {
    // logged in:

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
              {data.userById.firstname} {data.userById.lastname}
            </Box>
          </HStack>
        </GridItem>
        <GridItem colSpan={7} rowSpan={1}>
          <HStack boxSize="100%" ml={2}>
            <Box>{data.userById.email}</Box>
          </HStack>
        </GridItem>
        <GridItem colSpan={4} rowSpan={2}>
          <VStack boxSize="100%" ml={2} align="left" justify="center">
            <Box>Service : {data.userById.service.name}</Box>
            <Box>Poste : {data.userById.poste.name}</Box>
          </VStack>
        </GridItem>
        <GridItem colSpan={4} rowSpan={2}>
          <VStack boxSize="100%" mr={2} align="right" justify="center">
            <HStack align="right" justify="right">
              <Text>Accepted ?</Text>
              <Text
                color={
                  data.userById.accepted
                    ? theme.colors.teal[500]
                    : theme.colors.red[500]
                }
              >
                {data.userById.accepted.toString()}
              </Text>
            </HStack>
            <HStack align="right" justify="right">
              <Text>Admin ?</Text>
              <Text
                color={
                  data.userById.admin
                    ? theme.colors.teal[500]
                    : theme.colors.gray[500]
                }
              >
                {data.userById.admin.toString()}
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
