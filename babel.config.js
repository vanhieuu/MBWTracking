module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      "module:react-native-dotenv",
      {
          moduleName: "@env",
          path: ".env",
      },
  ],
    'react-native-reanimated/plugin',
  ],
};
