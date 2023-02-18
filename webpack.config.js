const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = 
{
    mode: "development",
    entry: "./src/index.js",
    devtool: 'source-map',

    plugins:
    [
      new HtmlWebpackPlugin({
        title: 'Output Management',
        filename: 'index.html',
        template: './src/index.html',
      }),
    ],

    output:
    {
      clean: true,
    },

    module:
    {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
        ],
    },
};