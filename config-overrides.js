const { override, addWebpackAlias } = require("customize-cra");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    react: path.resolve("./node_modules/react")
  }),
  config => {
    if (config.mode === "development") {
      config.resolve.alias["react-dom"] = "@hot-loader/react-dom";
    }
    config = rewireReactHotLoader(config, config.mode);
    return config;
  }
);
