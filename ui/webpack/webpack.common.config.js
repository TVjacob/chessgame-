const path = require("path");

const parentDir = path.join(__dirname, "../");

module.exports = {
  entry: [path.join(parentDir, "index.js")],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader", "postcss-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
              publicPath: "/",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};

// const path = require('path');
// const webpack = require('webpack');

// const parentDir = path.join(__dirname, '../');

// module.exports = {
//     entry: [
//         path.join(parentDir, 'index.js')
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 loader: 'babel-loader',
//             },
//             {
//                 test: /\.less$/,
//                 loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
//             },
//             {
//                 test: /\.css$/,
//                 loaders: ['style-loader', 'css-loader', 'postcss-loader'],
//             },
//             {
//                 test: /\.(woff|woff2|ttf|eot)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[name].[ext]',
//                             outputPath: 'fonts/'
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.(gif|png|jpe?g|svg)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: 'img/[name].[ext]',
//                             publicPath: '/',
//                         },
//                     },
//                     {
//                         loader: 'image-webpack-loader',
//                         options: {
//                             bypassOnDebug: true,
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     output: {
//         path: parentDir + '/dist',
//         filename: 'bundle.js',
//     },
// }
