/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require('webpack');
const GasPlugin = require("gas-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: "production",
    devtool: 'source-map',
    context: __dirname,
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js",
        library: "JobBroker",
        libraryTarget: "this",
        environment: {
            arrowFunction: true
        }
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    stats: {
        errorDetails: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                }
            },
        ],
    },
    plugins: [
        new GasPlugin(),
        new ESLintPlugin({
            extensions: ['.ts', '.js'],
            exclude: 'node_modules'
        }),
    ],
};