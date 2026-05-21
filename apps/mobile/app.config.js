const { expo } = require("./app.json");

const profile = process.env.EAS_BUILD_PROFILE;
const variant = profile ? (profile === "development" ? "development" : "production") : (process.env.APP_VARIANT ?? "production");
const isDevelopment = variant === "development";

module.exports = {
  expo: {
    ...expo,
    name: isDevelopment ? "MigOculto Dev" : expo.name,
    slug: expo.slug,
    scheme: isDevelopment ? "migoculto-dev" : expo.scheme,
    ios: {
      ...expo.ios,
      bundleIdentifier: isDevelopment ? "com.cftechsol.migoculto.dev" : expo.ios.bundleIdentifier,
    },
    android: {
      ...expo.android,
      package: isDevelopment ? "com.cftechsol.migoculto.dev" : expo.android.package,
    },
    updates: isDevelopment
      ? {
          enabled: false,
        }
      : expo.updates,
    plugins: [
      ...(expo.plugins ?? []),
      [
        "expo-dev-client",
        {
          addGeneratedScheme: isDevelopment,
        },
      ],
    ],
    extra: {
      ...expo.extra,
      appVariant: variant,
    },
  },
};
