import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, useEffect, useState } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  showButton?: boolean;
};

// '' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  showButton,
  ...props
}) => {
  const [field, { error,  }] = useField(props);
  const [show, setShow] = useState(true);
  const handleClick = () => setShow(!show);

  useEffect(() => {
    showButton ? setShow(false) : null;
  }, []);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          {...field}
          {...props}
          id={field.name}
          type={show ? "text" : "password"}
        />
        {showButton ? (
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" tabIndex={-1} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        ) : null}
      </InputGroup>
      {error ? (
        <HStack spacing="4px">
          <WarningIcon w={4} h={4} color="red.500" />
          <FormErrorMessage>{error}</FormErrorMessage>
        </HStack>
      ) : null}
    </FormControl>
  );
};
