module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
      },
      {
        loader: require.resolve("react-docgen-typescript-loader"),
      },
    ],
  });

  // Add a new rule specifically for the Amplience module
  config.module.rules.push({
    test: /\.js$/,
    include: /node_modules\/@amplience/,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-optional-chaining"],
      },
    },
  });

  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
