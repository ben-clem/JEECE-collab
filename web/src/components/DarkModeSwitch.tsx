import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode, Switch, HStack } from "@chakra-ui/react";
import React from "react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <HStack spacing="5px">
      <SunIcon w={5} h={5} color={isDark ? "teal.700" : "teal.300"} />
      <Switch
        isChecked={isDark}
        onChange={toggleColorMode}
      />
      <MoonIcon w={5} h={5} color={isDark ? "teal.300" : "teal.700"} />
    </HStack>
  );
};
