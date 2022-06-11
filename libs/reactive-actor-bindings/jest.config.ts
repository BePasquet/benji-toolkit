/* eslint-disable */
export default {
  displayName: 'reactive-actor-bindings',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/reactive-actor-bindings',
};
