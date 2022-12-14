const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        client: path.join(__dirname, "client", "index.ts"),
    },
    output: {
        path: path.join(__dirname, "dist"),
    },
    mode: "development",
    context: path.join(__dirname, "client"),
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.png/,
                type: "asset/resource",
            },
        ],
    },
    devtool: "inline-source-map",
    watchOptions: {
        // File watching doesn't always work on Windows, so we fall back to polling
        poll: 1000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "head",
            template: path.join(__dirname, "client", "index.html"),
        }),
    ],
};

