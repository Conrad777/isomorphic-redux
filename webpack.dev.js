import webpack              from 'webpack';
import assign               from 'object-assign';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import prodCfg              from './webpack.prod.config.js';

var path = require('path');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin')
var webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools-configuration'))

Object.assign = assign;

const BABEL_QUERY = {
  presets: ['react', 'es2015'],
  plugins: [
    ['transform-object-rest-spread'],
    ['transform-class-properties'],
    ['transform-decorators-legacy'],
    [
      'react-transform',
      {
        transforms: [
          {
            transform: 'react-transform-hmr',
            imports:    ['react'],
            locals:     ['module']
          }
        ]
      }
    ]
  ]
}

export default function(app) {
  const config = Object.assign(prodCfg, {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname),
    entry:   [
      'webpack-hot-middleware/client',
      './client'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          test:    /\.jsx?$/,
          exclude: /node_modules/,
          loader:  'babel',
          query:   BABEL_QUERY
        },
        {
          test: /\.scss$/,
          loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
        }
      ]
    },
    plugins: [
      webpack_isomorphic_tools_plugin.development(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        __DEVTOOLS__: true
      })
    ],
  });

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true }));
  app.use(webpackHotMiddleware(compiler));
}
