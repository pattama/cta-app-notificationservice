'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const requireSubvert = require('require-subvert')(__dirname);
const nodepath = require('path');

const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'base'));
let Http = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'http'));
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

describe('AfterHandler - Http - constructor', function() {
  let StubHelper;
  let stubHelperInstance;
  let http;
  before(function() {
    // stubing and spying the HttpHelper Class required in Http class
    // returns a mocked HttpHelper
    stubHelperInstance = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    StubHelper = sinon.stub().returns(stubHelperInstance);
    requireSubvert.subvert(
      nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/http/httphelper'),
      StubHelper);
    Http = requireSubvert.require(
      nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/http'));

    http = new Http(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });
  context('when everything ok', function() {
    it('should extend Base Provider', function() {
      expect(Object.getPrototypeOf(Http)).to.equal(Base);
    });

    it('should be a new AfterHandler Http instance', function() {
      expect(http).to.be.an.instanceOf(Http);
    });

    describe('_configure', function() {
      it('should have a configuration object', function() {
        expect(http).to.have.property('configuration')
          .and.to.be.an('object');
      });
    });

    it('should have a HttpHelper instance', function() {
      expect(StubHelper.calledWithExactly(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration)).to.equal(true);
      expect(http).to.have.property('httpHelper').and.to.be.an.instanceof(HttpHelper);
      expect(http.httpHelper).to.equal(stubHelperInstance);
    });
  });
});

describe('AfterHandler - Http - validate', function() {
  let http;
  before(function() {
    http = new Http(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });

  describe('validate', function() {
    it('should return httpHelper.validate method', function() {
      expect(http.validate).to.be.equal(http.httpHelper.validate);
    });
  });
});
