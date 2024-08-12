/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#BBE1FA";
const tintColorDark = "#3282B8";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    backgroundChat: "#BBE1FA",
    tint: tintColorLight,
    statusBG: "#e8b0d1",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#1B262C",
    backgroundChat: "#0F4C75",
    tint: tintColorDark,
    statusBG: "#8a2861",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
