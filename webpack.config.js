const { resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')

class ClearTerminalInWatchMode {
  apply(compiler) {
    compiler.hooks.afterCompile.tap('ClearTerminalInWatchMode', () => {
      if (compiler.watchMode) console.clear()
    })
  }
}

module.exports = (env, { mode = 'development' } = {}) => ({
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: './src/index.ts',
    util: './src/settings/external-utils.ts'
  },
  output: {
    path: resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'scrape-pages',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.sql$/,
        use: 'raw-loader'
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(['package.json', 'package-lock.json', 'LICENSE', 'README.md']),
    new ClearTerminalInWatchMode()
  ],
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()]
  },
  externals: [nodeExternals()]
})
