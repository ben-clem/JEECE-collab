import { Flex, useColorMode, FlexProps } from "@chakra-ui/react";
import theme from "../theme";

export const Container = (props: FlexProps) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={theme.colors.contentBg[colorMode]}
      color={theme.colors.content[colorMode]}
      {...props}
    />
  );
};
