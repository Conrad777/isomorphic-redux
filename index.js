var path = require('path');

require('babel-core/register')({});


if (process.env.NODE_ENV !== 'production') {
  var fs = require('fs');
  fs.closeSync(fs.openSync(path.join(__dirname, '..', 'webpack-assets.json'), 'w'));
}

var Webpack_isomorphic_tools = require('webpack-isomorphic-tools')

var project_base_path = require('path').resolve(__dirname, 'client')

// this global variable will be used later in express middleware
global.webpack_isomorphic_tools = new Webpack_isomorphic_tools(require('./webpack-isomorphic-tools-configuration'))
.development(process.env.NODE_ENV !== 'production')
.server(project_base_path, function() {
  var server = require('./server').default;

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, function() {
  	console.log('Listening on port %s...', PORT);
  })
})



// var server = require('./server').default;

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, function () {
//   console.log('Server listening on: ' + PORT);
// });
