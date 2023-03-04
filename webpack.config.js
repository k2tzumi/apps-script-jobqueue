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
        globalObject: 'this',
        environment: {
            arrowFunction: true
        }
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    node: {
        __dirname: true,
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
        new GasPlugin({ autoGlobalExportsFiles: ['*.ts'] }),
        new ESLintPlugin({
            extensions: ['.ts', '.js'],
            exclude: 'node_modules'
        }),
    ],
};