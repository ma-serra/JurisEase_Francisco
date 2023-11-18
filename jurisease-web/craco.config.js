module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify")
        }
      }
    }
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  },
  externals: {
    mammoth: "mammoth"
  }
};
