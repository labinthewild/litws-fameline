var path = require("path");

var config = {
  mode: 'development',
  // mode: 'production',
  entry: path.join(__dirname, "study.js"),
  output: {
    path: path.join(__dirname, "js"),
    filename: "study-bundle.min.js"
  },
  module: {
    rules: [
        {
          test: /.*\.html$/,
          loader: "html-loader",
          options: {
            sources: false,
          }
        }
    ]
  },
  externals: [
    /^(jquery.i18n|\$)$/i,
    {
       d3: "d3"
    }
  ],
  resolve: {
    fallback: {
      "fs": false,
      "path": false,
      "url": false
    },
  }
};

module.exports = config;