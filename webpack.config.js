const nodeExternals = require('webpack-node-externals');
module.exports = {
    "target": "node",
    externals: [nodeExternals()],
    mode: 'development',
    watch: true,

    resolve: {
        fallback: { 
            "stream": require.resolve("stream-browserify"),
            "http": require.resolve("stream-http") }
      }

  };