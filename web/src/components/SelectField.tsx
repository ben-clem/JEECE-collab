import { WarningIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  InputGroup,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";

type SelectFieldProps = InputHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: any;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  size: _,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [selected, setSelected] = useState(false);

  // Hook that alerts clicks outside of the passed ref
  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      //Alert if clicked on outside of element
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target) && selected) {
          setSelected(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, selected]);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  let color = useColorModeValue(selected || field.value ? "black" : "blackAlpha.300", selected || field.value ? "white" : "whiteAlpha.300")

  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputGroup size="md">
        <Select
          {...field}
          {...props}
          id={field.name}
          value={field.value}
          onChange={(e) => helpers.setValue(parseInt(e.target.value, 10))}
          onFocus={() => {
            setSelected(true);
          }}
          ref={wrapperRef}
          color={color}
        >
          {options.map((option: { id: number; name: string }) => (
            <option key={option.id} value={option.id}>
              {option.name} {option.id}
            </option>
          ))}
        </Select>
      </InputGroup>
      {meta.error ? (
        <HStack spacing="4px">
          <WarningIcon w={4} h={4} color="red.500" />
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        </HStack>
      ) : null}
    </FormControl>
  );
};
