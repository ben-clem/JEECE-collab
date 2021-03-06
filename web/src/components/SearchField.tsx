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
  useColorModeValue,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, useState } from "react";
import theme from "../theme";

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  isLoading?: boolean;
};

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  size: _,
  isLoading,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl boxSize="100%" isInvalid={!!error}>
      <InputGroup boxSize="100%">
        <Input {...field} {...props} id={field.name} boxSize="100%"></Input>
        <InputRightElement h="100%" w="4.1rem" mr={1}>
          <Button size="xs" type="submit" colorScheme="teal" isLoading={isLoading}>
            search
          </Button>
        </InputRightElement>
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
