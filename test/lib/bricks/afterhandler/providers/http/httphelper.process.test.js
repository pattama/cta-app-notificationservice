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
const _ = require('lodash');
const nock = require('nock');

const HttpHelperPath = nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/http', 'httphelper');
let HttpHelper = require(HttpHelperPath);
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
const afterhandlerJob = require('./job.afterhandler.http.sample.testdata.js');

describe('AfterHandler - Http - HttpHelper - process', function() {
  let httpHelper;
  before(function() {
    httpHelper = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });
  context('when request() succeeds', function() {
    context('GET - statusCode is ok', function() {
      const job = _.cloneDeep(afterhandlerJob);
      const baseUrl = 'http://localhost:3000';
      const uri = '/api';
      const response = {
        code: 200,
        body: { foo: 'bar' },
      };
      let promise;
      before(function(done) {
        job.payload.method = 'GET';
        job.payload.url = baseUrl + uri;
        job.payload.returncodes = [response.code];
        nock(baseUrl)
          .get(uri)
          .reply(response.code, response.body);
        httpHelper.process(job).then(function(res) {
          promise = res;
          done();
        }).catch(done);
      });
      after(function() {
        nock.cleanAll();
      });
      it('should resolve with ok:1 and response', function() {
        expect(promise).to.have.property('ok', 1);
        expect(promise).to.have.property('body').that.exist; // eslint-disable-line no-unused-expressions
        expect(promise).to.have.property('statuscode', response.code);
      });
    });

    context('GET - statusCode is not ok (e.g. not expected)', function() {
      const job = _.cloneDeep(afterhandlerJob);
      const baseUrl = 'http://localhost:3000';
      const uri = '/api';
      const response = {
        code: 400,
        body: { foo: 'bar' },
      };
      let promise;
      before(function(done) {
        job.payload.method = 'GET';
        job.payload.url = baseUrl + uri;
        job.payload.returncodes = [];
        nock(baseUrl)
          .get(uri)
          .reply(response.code, response.body);
        httpHelper.process(job).then(function(res) {
          promise = res;
          done();
        }).catch(done);
      });
      after(function() {
        nock.restore();
      });
      it('should resolve with ok:0 and response', function() {
        expect(promise).to.have.property('ok', 0);
        expect(promise).to.have.property('body').that.exist; // eslint-disable-line no-unused-expressions
        expect(promise).to.have.property('statuscode', response.code);
      });
    });
  });

  context('when request() fails', function() {
    const job = _.cloneDeep(afterhandlerJob);
    let stubHttpHelper;
    let stubRequest;
    const mockRequestError = new Error('mock request error');
    before(function() {
      stubRequest = sinon.stub().callsArgWith(1, mockRequestError);
      requireSubvert.subvert('request', stubRequest);
      HttpHelper = requireSubvert.require(HttpHelperPath);
      stubHttpHelper = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });
    after(function() {
      requireSubvert.cleanUp();
    });
    it('should reject with request() error', function() {
      const validatePromise = stubHttpHelper.process(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockRequestError);
    });
  });
});
