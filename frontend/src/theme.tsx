import { background, extendTheme} from "@chakra-ui/react"
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools"

const disabledStyles = {
  _disabled: {
    backgroundColor: "ui.main",
  },
}

const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body:{
        bg: mode("#e6e9ef", "#4c4f69")(props),
        transitionProperty:"background-color",
        transitionDuration:"300ms",
      }
    })
  },
  colors: {
    ui: {
      main: "#209fb5",
      secondary: "#eff1f5"  ,
      success: "#40a02b",
      danger: "#d20f39",
      light: "#e6e9ef",
      dark: "#4c4f69",
      darkSlate: "#5c5f77",
      dim: "#A0AEC0",
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: "ui.main",
          color: "ui.light",
          _hover: {
            backgroundColor: "#00766C",
          },
          _disabled: {
            ...disabledStyles,
            _hover: {
              ...disabledStyles,
            },
          },
        },
        danger: {
          backgroundColor: "ui.danger",
          color: "ui.light",
          _hover: {
            backgroundColor: "#E32727",
          },
        },
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            _selected: {
              color: "ui.main",
            },
          },
        },
      },
    },
  },
})

export default theme
