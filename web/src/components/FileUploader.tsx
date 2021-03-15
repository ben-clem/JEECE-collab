import { Box } from "@chakra-ui/react";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { useAddDocumentMutation, useAddProfilePicMutation } from "../graphql/generated";

interface FileUploaderProps {
  fileTypes: string[];
  name: string;
  url: string;
  services?: boolean[];
  postes?: boolean[];
  id?: number;
  boxSize?: string;
}

export const FileUploader = (props: FileUploaderProps) => {
  registerPlugin(FilePondPluginFileValidateType);

  const [savingInDb, setSavingInDb] = useState<boolean>(false);
  const [serverId, setServerId] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  const [, addDocument] = useAddDocumentMutation();
  const [, addProfilePic] = useAddProfilePicMutation();

  useEffect(() => {
    if (savingInDb && serverId !== "" && filename !== "") {
      if (props.name === "documents") {
        let servicesIds: number[] = [];
        if (props.services) {
          for (const [i, serviceBool] of props.services.entries()) {
            if (serviceBool) {
              servicesIds.push(i + 1);
            }
          }
        }

        let postesIds: number[] = [];
        if (props.postes) {
          for (const [i, posteBool] of props.postes.entries()) {
            if (posteBool) {
              postesIds.push(i + 1);
            }
          }
        }

        const addingDoc = async () => {
          await addDocument({
            path: serverId,
            name: filename,
            servicesIds,
            postesIds,
          });
        };
        addingDoc();
      }

      if (props.name === "profilePics" && props.id !== undefined) {
        const addingProfilePic = async () => {
        await addProfilePic({
          id: props.id as number,
          path: serverId,
        });
      };
      addingProfilePic();
      }

     
      setSavingInDb(false);
      setServerId("");
      setFilename("");

      
    }
  }, [savingInDb, serverId, filename]);

  return (
    <Box boxSize={props.boxSize ? props.boxSize : "auto"} m={3} mt={5}>
      <FilePond
        allowMultiple={false}
        maxFiles={1}
        dropOnPage
        dropValidation
        acceptedFileTypes={props.fileTypes}
        name={props.name}
        server={props.url}
        onprocessfile={(err, file) => {
          if (err) {
            console.log("err: ", err);
            return;
          }
          // file has been uploaded to server filesystem, we must now store its info in DB:
          setSavingInDb(true);
          setServerId(file.serverId);
          setFilename(file.filename);
          file.abortLoad();
        }}
      />
    </Box>
  );
};
