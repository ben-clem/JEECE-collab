import {
  AspectRatio,
  Avatar,
  Box,
  Center,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Spinner,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { CONTAINER_HEIGHT } from "../constants";
import {
  useMeQuery,
  usePosteByIdQuery,
  useServiceByIdQuery,
} from "../graphql/generated";
import theme from "../theme";
import { isServer } from "../utils/isServer";
import { Text } from "@chakra-ui/react";

export const UserInfo = (props: FlexProps) => {
  const { colorMode } = useColorMode();
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer(), // pause this request anytime this page is rendered server-side (the server doesn't have access to the userToken cookie)
  });

  let body = null;

  // fetching: waiting
  if (meFetching) {
    // logged in:
  } else if (meData?.me) {
    const [
      { data: serviceByIdData, fetching: serviceByIdFetching },
    ] = useServiceByIdQuery({
      variables: {
        id: meData.me.id,
      },
      pause: false, // this request can be done server-side
    });
    const [
      { data: posteByIdData, fetching: posteByIdFetching },
    ] = usePosteByIdQuery({
      variables: {
        id: meData.me.id,
      },
      pause: false, // this request can be done server-side
    });

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
              {meData.me.firstname} {meData.me.lastname}
            </Box>
          </HStack>
        </GridItem>
        <GridItem colSpan={7} rowSpan={1}>
          <HStack boxSize="100%" ml={2}>
            <Box>{meData.me.email}</Box>
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
                  meData.me.accepted
                    ? theme.colors.teal[500]
                    : theme.colors.red[500]
                }
              >
                {meData.me.accepted.toString()}
              </Text>
            </HStack>
            <HStack align="right" justify="right">
              <Text>Admin ?</Text>
              <Text
                color={
                  meData.me.admin
                    ? theme.colors.teal[500]
                    : theme.colors.gray[500]
                }
              >
                {meData.me.admin.toString()}
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
        <Heading as="h4">You're not logged in!</Heading>
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
