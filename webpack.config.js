/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require('webpack');
const GasPlugin = require("gas-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: "none",
    devtool: 'source-map',
    context: __dirname,
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js",
        library: "JobBroker",
        libraryTarget: "this",
        globalObject: 'this',
        environment: {
            arrowFunction: false
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
                test: /\.[tj]s$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": {
                                        "browsers": ["ie 8"]
                                    }
                                }
                            ],
                            "@babel/preset-typescript"
                        ]
                    }
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