import {
  Box,
  Checkbox,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { FileUploader } from "./FileUploader";

interface DocumentsUploaderProps {}

export const DocumentsUploader: React.FC<DocumentsUploaderProps> = ({}) => {
  const [checkedServices, setCheckedServices] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const allServicesChecked = checkedServices.every(Boolean);
  const isServicesIndeterminate =
    checkedServices.some(Boolean) && !allServicesChecked;

  const [checkedPostes, setCheckedPostes] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const allPostesChecked = checkedPostes.every(Boolean);
  const isPostesIndeterminate =
    checkedPostes.some(Boolean) && !allPostesChecked;

  return (
    <>
      <Heading as="h2" size="md" my={2}>
        Dépôts de documents (pdf)
      </Heading>

      <HStack align="top" justify="left" ml={5} mt={5} mb={10}>
        <Box align="left">
          <Checkbox
            isChecked={allServicesChecked}
            isIndeterminate={isServicesIndeterminate}
            onChange={(e) =>
              setCheckedServices([
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
              ])
            }
          >
            Services
          </Checkbox>
          <Stack pl={6} mt={1} spacing={1}>
            <Checkbox
              isChecked={checkedServices[0]}
              onChange={(e) =>
                setCheckedServices([
                  e.target.checked,
                  checkedServices[1],
                  checkedServices[2],
                  checkedServices[3],
                  checkedServices[4],
                  checkedServices[5],
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              Commercial
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[1]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  e.target.checked,
                  checkedServices[2],
                  checkedServices[3],
                  checkedServices[4],
                  checkedServices[5],
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              Marketing
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[2]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  e.target.checked,
                  checkedServices[3],
                  checkedServices[4],
                  checkedServices[5],
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              Finance
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[3]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  checkedServices[2],
                  e.target.checked,
                  checkedServices[4],
                  checkedServices[5],
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              Industrie
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[4]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  checkedServices[2],
                  checkedServices[3],
                  e.target.checked,
                  checkedServices[5],
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              RH
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[5]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  checkedServices[2],
                  checkedServices[3],
                  checkedServices[4],
                  e.target.checked,
                  checkedServices[6],
                  checkedServices[7],
                ])
              }
            >
              R/D
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[6]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  checkedServices[2],
                  checkedServices[3],
                  checkedServices[4],
                  checkedServices[5],
                  e.target.checked,
                  checkedServices[7],
                ])
              }
            >
              Achats
            </Checkbox>
            <Checkbox
              isChecked={checkedServices[7]}
              onChange={(e) =>
                setCheckedServices([
                  checkedServices[0],
                  checkedServices[1],
                  checkedServices[2],
                  checkedServices[3],
                  checkedServices[4],
                  checkedServices[5],
                  checkedServices[6],
                  e.target.checked,
                ])
              }
            >
              Juridique
            </Checkbox>
          </Stack>
        </Box>

        <Spacer />

        <Box align="left">
          <Checkbox
            isChecked={allPostesChecked}
            isIndeterminate={isPostesIndeterminate}
            onChange={(e) =>
              setCheckedPostes([
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
                e.target.checked,
              ])
            }
          >
            Postes
          </Checkbox>
          <Stack pl={6} mt={1} spacing={1}>
            <Checkbox
              isChecked={checkedPostes[0]}
              onChange={(e) =>
                setCheckedPostes([
                  e.target.checked,
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Directeur
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[1]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  e.target.checked,
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Comptable{" "}
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[2]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  e.target.checked,
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Auditeur
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[3]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  e.target.checked,
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Comissaire aux comptes
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[4]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  e.target.checked,
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Responsable
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[5]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  e.target.checked,
                  checkedPostes[6],
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Ingénieur
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[6]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  e.target.checked,
                  checkedPostes[7],
                  checkedPostes[8],
                ])
              }
            >
              Développeur
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[7]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  e.target.checked,
                  checkedPostes[8],
                ])
              }
            >
              Stagiaire
            </Checkbox>
            <Checkbox
              isChecked={checkedPostes[8]}
              onChange={(e) =>
                setCheckedPostes([
                  checkedPostes[0],
                  checkedPostes[1],
                  checkedPostes[2],
                  checkedPostes[3],
                  checkedPostes[4],
                  checkedPostes[5],
                  checkedPostes[6],
                  checkedPostes[7],
                  e.target.checked,
                ])
              }
            >
              Community Manager
            </Checkbox>
          </Stack>
        </Box>
        <Spacer />
      </HStack>

      <FileUploader
        fileTypes={["application/pdf"]}
        name="documents"
        url="http://localhost:4000/api/documents"
        services={checkedServices}
        postes={checkedPostes}
      />
    </>
  );
};
