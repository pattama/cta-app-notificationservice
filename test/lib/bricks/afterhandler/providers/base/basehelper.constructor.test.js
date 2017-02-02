'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const BaseHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/base', 'basehelper'));
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

describe('AfterHandler - Base - BaseHelper - constructor', function() {
  context('when arguments are valid', function() {
    let baseHelper;
    before(function() {
      baseHelper = new BaseHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });
    it('should return a BaseHelper instance', function() {
      expect(baseHelper).to.be.an.instanceof(BaseHelper);
    });
    it('should have cementHelper property', function() {
      expect(baseHelper).to.have.property('cementHelper', DEFAULTCEMENTHELPER);
    });
    it('should have logger property', function() {
      expect(baseHelper).to.have.property('logger', DEFAULTLOGGER);
    });
    it('should have logger property', function() {
      expect(baseHelper).to.have.property('configuration', configuration);
    });
  });
});

describe('AfterHandler - Base - BaseHelper - validate', function() {
  context('when arguments are valid', function() {
    let baseHelper;
    before(function() {
      baseHelper = new BaseHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });
    it('should reject', function() {
      const validatePromise = baseHelper.validate({});
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'validate method not overriden by provider helper');
    });
  });
});

describe('AfterHandler - Base - BaseHelper - process', function() {
  context('when arguments are valid', function() {
    let baseHelper;
    before(function() {
      baseHelper = new BaseHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });
    it('should reject', function() {
      const validatePromise = baseHelper.process({});
      return expect(validatePromise).to.eventually
        .be.rejectedWith(Error, 'process method not overriden by provider helper');
    });
  });
});
