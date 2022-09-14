const webpack = require("webpack");

let config = require("./webpack.base.config.js");
config.plugins.push(new webpack.EnvironmentPlugin({
    'RIVET_MATCHMAKER_API_URL': process.env.RIVET_MATCHMAKER_API_URL,
}));
module.exports = config;

