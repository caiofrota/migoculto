/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#8b0000";
const tintColorDark = "#ffd7a3";

export const Colors = {
  light: {
    text: "#2f1111",
    background: "#fff8ef",
    tint: tintColorLight,
    icon: "#7a4c4c",
    tabIconDefault: "#7a4c4c",
    tabIconSelected: tintColorLight,
    border: "#ffd7a3",
    card: "#ffffff",
    danger: "#a41717",
    muted: "#7a4c4c",
  },
  dark: {
    text: "#fff3e6",
    background: "#300101",
    tint: tintColorDark,
    icon: "#ffd7a3",
    tabIconDefault: "#d8aa75",
    tabIconSelected: tintColorDark,
    border: "#6b0000",
    card: "#4f0606",
    danger: "#ffc46b",
    muted: "#d8aa75",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
