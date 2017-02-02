'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const BaseHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/base', 'basehelper'));
const EmailHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/email', 'emailhelper'));
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

describe('AfterHandler - Email - EmailHelper - constructor', function() {
  context('when missing/incorrect \'templates\' Map argument', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, {});
      }).to.throw(Error, 'missing/incorrect \'templates\' Map argument');
    });
  });

  context('when arguments are valid', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      emailHelper = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, templates);
    });
    it('should return an EmailHelper instance', function() {
      expect(emailHelper).to.be.an.instanceof(EmailHelper);
    });
    it('should extend BaseHelper', function() {
      expect(Object.getPrototypeOf(EmailHelper)).to.equal(BaseHelper);
    });
    it('should have templates property', function() {
      expect(emailHelper).to.have.property('templates', templates);
    });
  });
});
