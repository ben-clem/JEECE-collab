import React, { InputHTMLAttributes, useEffect, useState } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

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
  const [field, { error }] = useField(props);
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
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        ) : null}
      </InputGroup>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
