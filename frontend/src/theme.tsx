import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
    },

    body: {
      fontSize: "0.95rem",
      margin: 0,
      padding: 0,
      fontFamily: "Inter, sans-serif",
      transition: "0.3s ease",
    },

    "*": {
      boxSizing: "border-box",
    },

    ".main-link": {
      color: "#8B5CF6",
      fontWeight: "bold",
    },
  },

  theme: {
    tokens: {
      colors: {
        ui: {
          main: { value: "#8B5CF6" },
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
})