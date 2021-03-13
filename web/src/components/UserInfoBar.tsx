import {
  Avatar,
  Box,
  Button,
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

type UserInfoBarProps = {
  id: number;
};

export const UserInfoBar = (props: UserInfoBarProps) => {
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
    // got user:
    body = (
      <HStack ml={2}>
        <Avatar size="xs" />
        <Text>
          {data.userById.firstname} {data.userById.lastname}
        </Text>
        <Text as="i" fontSize="md" color={theme.colors.contentTrans[colorMode]}>
          ({data.userById.poste.name} {data.userById.service.name}
          {", "}
          {data.userById.email})
        </Text>
      </HStack>
    );

    // not logged in:
  } else {
    body = (
      <Center>
        <Heading as="h4">Need userId</Heading>
      </Center>
    );
  }

  return body;
};
