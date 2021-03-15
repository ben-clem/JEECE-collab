import { Box, Spacer } from "@chakra-ui/layout";
import { useColorMode, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MyContainer } from "../../components/Container";
import { FileUploader } from "../../components/FileUploader";
import { MeInfo } from "../../components/MeInfo";
import { NavBar } from "../../components/NavBar";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface ProfilePicUploadProps {}

const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const [id, setId] = useState<number>(0);
  useEffect(() => {
    if (router.query.id) {
      setId(parseInt(router.query.id[0], 10));
    }
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <MyContainer>
        <Box
          h="9rem"
          mt={10}
          bg={theme.colors.transparent[colorMode]}
          borderRadius="lg"
        >
          <MeInfo />
        </Box>
        <Spacer />
        <Text>Upload new profile picture:</Text>
        <FileUploader
          fileTypes={["image/*"]}
          name="profilePics"
          url="http://localhost:4000/api/profilePics"
          id={id}
          boxSize="50%"
        />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
      </MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(
  ProfilePicUpload
);
