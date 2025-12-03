import Constants from "expo-constants";

export const isExpoGo = Constants.executionEnvironment === "storeClient";
export const isStandalone = Constants.executionEnvironment === "bare" && !__DEV__;
export const isDevClient = Constants.executionEnvironment === "bare" && __DEV__;
