const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  context: __dirname,
  entry: './src/index.js',

  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // exclude: /node_modules/,
        exclude: /node_modules(?!\/webpack-dev-server)/,
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
      // added code to work with svg
      // {
      //   test: /\.jsx?$/, // Match both .js and .jsx files
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      //   query: {
      //     presets: ['react'],
      //   },
      // },
      {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: 'file-loader'
      //     },
      //     {
      //       loader: 'svgo-loader',
      //       options: {
      //         plugins: [
      //           {removeTitle: true},
      //           {convertColors: {shorthex: false}},
      //           {convertPathData: false}
      //         ]
      //       }
      //     }
      //   ]
      // },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    // port:8000,
    proxy: {'/api':'http://localhost:3000'},
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions:{
        properties: {
          compress: {
            warnings: false,
            comparisons: false, // don't optimize comparisons
          }
        }
      },
    }),
    new ExtractTextPlugin({ filename: 'src/public/stylesheets/app.css', allChunks: true }),
  ],
};

module.exports = config;
