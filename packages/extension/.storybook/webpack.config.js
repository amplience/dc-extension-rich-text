module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
      },
      // Optional
      {
        loader: require.resolve("react-docgen-typescript-loader"),
      },
    ],
  });

  // transpile JS files from @amplience/content-studio-sdk
  config.module.rules.push({
    test: /\.js$/,
    include: /node_modules[\\/]@amplience[\\/]content-studio-sdk/,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        presets: [require.resolve("@babel/preset-env")],
      },
    },
  });
  config.resolve.extensions.push(".ts", ".tsx", ".js");

  return config;
};
