import { Heading } from "@chakra-ui/react";
import React from "react";

interface DocumentsUploaderProps {}

export const DocumentsUploader: React.FC<DocumentsUploaderProps> = ({}) => {
  return (
    <Heading as="h2" size="md" mt={2}>
      Dépôts de documents (pdf)
    </Heading>
  );
};
