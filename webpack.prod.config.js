const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './frontend/index'
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env', 'react', 'stage-2'],
                            plugins: ['babel-plugin-transform-runtime']
                        }
                    }
                ]
            },
            { test: /\.s?css$/, loader: 'style-loader!css-loader' },
        ],
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    output: {
        path: path.join(__dirname, '/public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: './public',
        hot: true
    },
    mode: "production"
};
