import { withUrqlClient } from "next-urql";
import React from "react";
import { MyContainer } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ProfilePicUploadProps {}

const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({}) => {
  return (
    <>
      <NavBar></NavBar>
      <MyContainer></MyContainer>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(
  ProfilePicUpload
);
