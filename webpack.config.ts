import * as webpack from 'webpack'
import cssnano = require('cssnano')
import dotenv = require('dotenv')
import HtmlWebpackPlugin = require('html-webpack-plugin')
import path = require('path')
// import TerserPlugin from 'terser-webpack-plugin';

const IS_DEV = process.env.NODE_ENV !== 'production'
const WEBPACK_PORT = 3000
const nodeModulesPath = path.resolve(__dirname, 'node_modules')
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead'

if (IS_DEV) {
    dotenv.config({ path: '.env' })
}

const config: webpack.Configuration = {
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'inline-source-map' : false,
    entry: ['./src/client/index.tsx'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].bundle.js',
        chunkFilename: 'js/[name].[contenthash].bundle.js',
        assetModuleFilename: 'images/[hash][ext][query]' // new in webpack 5
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    optimization: {
        minimize: !IS_DEV,
        // minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, nodeModulesPath],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/env', { modules: false, targets }], '@babel/react', '@babel/typescript'],
                        plugins: [
                            '@babel/proposal-numeric-separator',
                            '@babel/plugin-transform-runtime',
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localsConvention: 'camelCase',
                            sourceMap: IS_DEV
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: IS_DEV,
                            plugins: IS_DEV ? [cssnano()] : []
                        }
                    }
                ]
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
                // use: 'url-loader?limit=10000'
                type: 'asset/resource' // webpack new asset/ressource for loading files instead of using loaders
            }
        ]
    },
    devServer: {
        port: WEBPACK_PORT,
        overlay: IS_DEV,
        open: IS_DEV,
        hot: true,
        compress: true,
        stats: 'errors-only',
        contentBase: path.join(__dirname, 'src', 'client')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
}

export default config
