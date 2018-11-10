const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true
  },
  webpack: {
    extra: {
      plugins: [new StatsPlugin('/stats.json')],
    },
    uglify: false,
    html: {
      template: 'demo/src/index.html',
    },
  },
};
