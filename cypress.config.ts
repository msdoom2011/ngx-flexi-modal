import { defineConfig } from 'cypress';

import coverageWebpack from './cypress/coverage.webpack';

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      webpackConfig: coverageWebpack,
    },
    specPattern: './cypress/tests/**/*.cy.ts',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
});
