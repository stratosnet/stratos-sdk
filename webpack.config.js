const webpack = require('webpack');
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const commonConfig = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new tsconfigPathsPlugin()],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /wordlists\/(french|spanish|italian|korean|chinese_simplified|chinese_traditional|japanese)\.json$/,
    }),
  ],
};

// const webConfig = {
//   ...commonConfig,
//   target: 'web',
//   output: {
//     filename: 'bundle.js',
//     libraryTarget: 'umd',
//     library: 'Terra',
//   },
//   resolve: {
//     ...commonConfig.resolve,
//     fallback: {
//       stream: require.resolve('stream-browserify'),
//       buffer: require.resolve('buffer'),
//     },
//   },
//   plugins: [...commonConfig.plugins],
// };

const nodeConfig = {
  ...commonConfig,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    filename: 'bundle.node.js',
  },
};

module.exports = [nodeConfig];
