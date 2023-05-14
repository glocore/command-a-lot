/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

const { join } = require("path");

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import("./version/getVersion.mjs");

  return {
    productName: "Command-a-lot",
    directories: {
      output: "dist",
      buildResources: "buildResources",
    },
    files: [
      "packages/main/dist/**",
      "packages/preload/dist/**",
      {
        from: "../ui/dist",
        to: "packages/ui/dist",
      },
    ],
    // extraResources: ["../ui/dist/**"],
    extraMetadata: {
      version: getVersion(),
    },

    // Specify linux target just for disabling snap compilation
    linux: {
      target: "deb",
    },
  };
};
