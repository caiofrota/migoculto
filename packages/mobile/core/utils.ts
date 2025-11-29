import Constants from "expo-constants";

export const isExpoGo = Constants.executionEnvironment === "storeClient";
export const isStandalone = Constants.executionEnvironment === "standalone" && !__DEV__;
export const isDevClient = Constants.executionEnvironment === "standalone" && __DEV__;
