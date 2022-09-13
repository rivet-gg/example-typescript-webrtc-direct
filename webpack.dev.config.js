const path = require("path");
const DotenvWebpackPlugin = require("dotenv-webpack");

let config = require("./webpack.base.config.js");
config.plugins.push(new DotenvWebpackPlugin());
config.devServer = {
    static: path.join(__dirname,  "dist"),
    host: "0.0.0.0",
    port: 8080,
};
module.exports = config;
