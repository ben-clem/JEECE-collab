import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";
import { CONTAINER_HEIGHT } from "../constants";
import theme from "../theme";

export const MyContainer = (props: FlexProps) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      minH={CONTAINER_HEIGHT}
      maxW="100vw"
      bg={theme.colors.contentBg[colorMode]}
      color={theme.colors.content[colorMode]}
      {...props}
    />
  );
};
