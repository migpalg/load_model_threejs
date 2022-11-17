const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./webpack.common");

module.exports = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, "public"),
    },
  },
});
