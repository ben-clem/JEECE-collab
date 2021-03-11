import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    headerBg: { light: "rgb(255, 255, 255)", dark: "rgb(26, 32, 44)" },
    contentBg: { light: "rgb(247, 250, 252)", dark: "rgb(23, 25, 35)" },
    content: { light: "black", dark: "white" },
    contentTrans: { light: "blackAlpha.700", dark: "whiteAlpha.700" },
    transparent: { light: "blackAlpha.100", dark: "whiteAlpha.50" },
    placeholder: { light: "blackAlpha.300", dark: "whiteAlpha.300" },
  },
  fonts,
  breakpoints,
});

export default theme;
