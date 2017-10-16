'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom'],
        index: path.join(__dirname, '/src/index.jsx')
    },
    output: {
        contentBase: path.join(__dirname, '/public'),
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve('./'),
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                presets: [
                    'es2015',
                    'react',
                    'stage-0'
                ],
                plugins: [
                    'add-module-exports',
                    'transform-decorators-legacy',
                ]
            },
            exclude: /node_modules/,
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css')
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css!sass-loader')
        }, {
            test: /\.(png|gif|jpg)$/,
            loader: 'file?name=[path][name].[ext]'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin('[name].css'),
    ]
};
