'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'base'));
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
const configuration = {};

describe('AfterHandler - Base - constructor', function() {
  let base;
  before(function() {
    base = new Base(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });
  context('when everything ok', function() {
    it('should be a new AfterHandler Base instance', function() {
      expect(base).to.be.an.instanceOf(Base);
    });

    it('should have a cementHelper instance', function() {
      expect(base).to.have.property('cementHelper', DEFAULTCEMENTHELPER);
    });

    it('should have a logger instance', function() {
      expect(base).to.have.property('logger', DEFAULTLOGGER);
    });

    describe('_configure', function() {
      it('should have a configuration object', function() {
        expect(base).to.have.property('configuration', configuration);
      });
    });
  });
});
