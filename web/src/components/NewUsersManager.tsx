import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Maybe,
  Poste,
  Service,
  User,
  useUpdateUserAcceptedMutation,
  useUsersPendingQuery,
} from "../graphql/generated";
import { UserInfoBar } from "./UserInfoBar";
import theme from "../theme";

interface NewUsersManagerProps {}

export const NewUsersManager: React.FC<NewUsersManagerProps> = ({}) => {
  const { colorMode } = useColorMode();

  // getting the pending users
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingUsers, setPendingUsers] = useState<
    Maybe<
      Array<
        { __typename?: "User" } & Pick<
          User,
          | "id"
          | "email"
          | "firstname"
          | "lastname"
          | "accepted"
          | "admin"
          | "profilePicPath"
          | "createdAt"
          | "updatedAt"
        > & {
            service: { __typename?: "Service" } & Pick<Service, "id" | "name">;
            poste: { __typename?: "Poste" } & Pick<Poste, "id" | "name">;
          }
      >
    >
  >([]);
  const [usersPendingResult] = useUsersPendingQuery({
    pause: false, // can be done server-side
  });
  useEffect(() => {
    if (
      loading &&
      !usersPendingResult.fetching &&
      !usersPendingResult.error &&
      usersPendingResult.data &&
      usersPendingResult.data.usersPending &&
      usersPendingResult.data?.usersPending?.length !== 0
    ) {
      setPendingUsers(usersPendingResult.data?.usersPending);
      setLoading(false);
    }
  }, [usersPendingResult]);

  // updating the status on click
  const [updating, setUpdating] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const [value, setValue] = useState<boolean | null>(null);
  const [, updateUserAccepted] = useUpdateUserAcceptedMutation();

  useEffect(() => {
    if (updating && id && value !== null) {
      console.log(pendingUsers);

      const updatingUser = async () => {
        await updateUserAccepted({
          id,
          accepted: value,
        });
      };
      updatingUser();

      if (pendingUsers) {
        setPendingUsers(pendingUsers?.filter((user) => user.id !== id));
      }

      setUpdating(false);
      setId(null);
      setValue(null);

      console.log(pendingUsers);
    }
  }, [updating]);

  return (
    <>
      <Heading as="h2" size="md" mt={2}>
        Traitement des nouveaux utilisateurs
      </Heading>
      {pendingUsers?.length === 0 ? (
        <Center blockSize="35%">
          <Text fontSize="sm" color={theme.colors.contentTrans[colorMode]}>
            Aucun nouvel utilisateur en attente...
          </Text>
        </Center>
      ) : (
        <VStack spacing={2}>
          {console.log(pendingUsers)}
          {pendingUsers
            ? pendingUsers.map((user) => {
                return (
                  <Flex
                    w="98%"
                    h="3rem"
                    align="center"
                    justify="left"
                    mt={2}
                    borderRadius="lg"
                    bg={theme.colors.tealTrans[colorMode]}
                    key={user.id}
                  >
                    <HStack spacing={3} ml={2}>
                      <IconButton
                        size="sm"
                        colorScheme="green"
                        aria-label="accept"
                        icon={<CheckIcon />}
                        onClick={() => {
                          setUpdating(true);
                          setId(user.id);
                          setValue(true);
                        }}
                      />
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        aria-label="refuse"
                        icon={<CloseIcon />}
                        onClick={() => {
                          setUpdating(true);
                          setId(user.id);
                          setValue(false);
                        }}
                      />
                      <UserInfoBar id={user.id} />
                    </HStack>
                  </Flex>
                );
              })
            : null}
        </VStack>
      )}
    </>
  );
};
