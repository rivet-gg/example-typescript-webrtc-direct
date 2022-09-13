const webpack = require("webpack");

let config = require("./webpack.base.config.js");
config.plugins.push(new webpack.DefinePlugin({
    'process.env': "{}"
}));
module.exports = config;

