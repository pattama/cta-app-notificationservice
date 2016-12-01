'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const BaseHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/base', 'basehelper'));
const HttpHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/http', 'httphelper'));
const Logger = require('cta-logger');
const DEFAULTCONFIG = {
  name: 'afterhandler',
  module: '../../lib/index',
  properties: {},
  publish: [],
};
const DEFAULTLOGGER = new Logger(null, null, DEFAULTCONFIG.name);
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: DEFAULTCONFIG.name,
  dependencies: {
    logger: DEFAULTLOGGER,
  },
};
const configuration = require('./configuration.testdata.js');

describe('AfterHandler - Http - HttpHelper - constructor', function() {
  context('when arguments are valid', function() {
    let httpHelper;
    before(function() {
      httpHelper = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });
    it('should return an EmailHelper instance', function() {
      expect(httpHelper).to.be.an.instanceof(HttpHelper);
    });
    it('should extend BaseHelper', function() {
      expect(Object.getPrototypeOf(HttpHelper)).to.equal(BaseHelper);
    });
  });
});
