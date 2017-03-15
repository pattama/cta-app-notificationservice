'use strict';

const load = require('cta-common').loader;

module.exports = {
  name: 'execution-dataservice',
  tools: load.asArray('tools', __dirname),
  bricks: load.asArray('bricks', __dirname),
  properties: {
    executionApiUrl: 'http://eds:3010/eds/',
    schedulerApiUrl: 'http://sch:3011/sch/',
    jobManagerApiUrl: 'http://jms:3012/jms/',
  },
};
