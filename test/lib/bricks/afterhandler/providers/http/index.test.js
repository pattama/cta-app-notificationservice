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

let Http = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'http'));
const HttpHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/http', 'httphelper'));
const logger = require('cta-logger');

const configuration = require('./configuration.testdata.js');
const DEFAULTLOGGER = logger();
describe('AfterHandler - Http - constructor', function() {
  let StubHelper;
  let stubHelperInstance;
  let http;
  before(function() {
    // stubing and spying the HttpHelper Class required in Http class
    // returns a mocked HttpHelper
    stubHelperInstance = new HttpHelper();
    StubHelper = sinon.stub().returns(stubHelperInstance);
    requireSubvert.subvert(
      nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/http/httphelper'),
      StubHelper);
    Http = requireSubvert.require(
      nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/http'));

    http = new Http(configuration, DEFAULTLOGGER);
  });
  context('when everything ok', function() {
    it('should be a new AfterHandler Http instance', function() {
      expect(http).to.be.an.instanceOf(Http);
    });

    it('should have a logger instance', function() {
      expect(http).to.have.property('logger', DEFAULTLOGGER);
    });

    describe('_configure', function() {
      it('should have a configuration object', function() {
        expect(http).to.have.property('configuration')
          .and.to.be.an('object');
      });
    });

    it('should have a HttpHelper instance', function() {
      expect(http).to.have.property('httpHelper').and.to.be.an.instanceof(HttpHelper);
      expect(http.httpHelper).to.equal(stubHelperInstance);
    });
  });
});

describe('AfterHandler - Http - validate', function() {
  let http;
  before(function() {
    http = new Http(configuration, DEFAULTLOGGER);
  });

  describe('validate', function() {
    it('should return httpHelper.validate method', function() {
      expect(http.validate).to.be.equal(http.httpHelper.validate);
    });
  });
});
