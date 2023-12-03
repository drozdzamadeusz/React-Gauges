const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const DIST_DIR = path.resolve(__dirname, "dist");

const CSS_ASSETS_SRC = path.resolve(__dirname, "src/assets");
const COPY_ASSETS_TO = path.resolve(__dirname, "dist/public/assets");

module.exports = {
  mode: "development",
  output: {
    filename: "index.js",
    path: DIST_DIR,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: ["src", "node_modules"],
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: DIST_DIR,
        },
        { from: CSS_ASSETS_SRC, to: COPY_ASSETS_TO },
      ],
    }),
  ],
  module: {
    rules: [
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
