'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const nodepath = require('path');
const _ = require('lodash');

const Context = require('cta-flowcontrol').Context;
const HttpHelperPath = nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/http', 'httphelper');
const HttpHelper = require(HttpHelperPath);
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
  createContext: function() {},
};
const configuration = require('./configuration.testdata.js');
const afterhandlerJob = require('./job.afterhandler.http.sample.testdata.js');

describe('AfterHandler - Http - HttpHelper - process', function() {
  let httpHelper;
  let requestJob;
  let requestContext;
  before(function() {
    httpHelper = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    const payload = _.pick(afterhandlerJob.payload, ['method', 'url', 'headers', 'body']);
    requestJob = {
      nature: {
        type: 'request',
        quality: 'exec',
      },
      payload: payload,
    };
    requestContext = new Context(DEFAULTCEMENTHELPER, requestJob);
    requestContext.publish = sinon.stub();

    sinon.stub(httpHelper.cementHelper, 'createContext')
      .withArgs(requestJob)
      .returns(requestContext);
  });

  context('when requestContext emit done event', function() {
    context('response.status is an expected returnCode', function() {
      let promise;
      const response = {
        status: 200,
        type: 'mock',
        body: {},
        headers: {},
      };
      before(function(done) {
        httpHelper.process(afterhandlerJob).then(function(res) {
          promise = res;
          done();
        }).catch(done);
        requestContext.emit('done', 'request', response);
      });
      after(function() {
      });

      it('should send a new insertContext', function() {
        sinon.assert.calledWith(httpHelper.cementHelper.createContext, requestJob);
        sinon.assert.called(requestContext.publish);
      });

      it('should resolve with response', function() {
        expect(promise).to.equal(response);
      });
    });

    context('response.status is not an expected returnCode', function() {
      let promise;
      const response = {
        status: 400,
        type: 'mock',
        body: {},
        headers: {},
      };
      before(function(done) {
        httpHelper.process(afterhandlerJob).then(function(res) {
          promise = res;
          done();
        }).catch(function(err) {
          promise = err;
          done();
        });
        requestContext.emit('done', 'request', response);
      });
      after(function() {
      });
      it('should reject with Error', function() {
        expect(promise).to.be.an('Error');
        expect(promise.message).to.equal(`unexpected HTTP status code ${response.status}`);
      });
    });
  });

  context('when requestContext emit reject event', function() {
    let promise;
    const error = new Error('mock error');
    before(function(done) {
      httpHelper.process(afterhandlerJob).then(function(res) {
        promise = res;
        done();
      }).catch(function(err) {
        promise = err;
        done();
      });
      requestContext.emit('reject', 'request', error);
    });
    after(function() {
    });
    it('should reject with Error', function() {
      expect(promise).to.equal(error);
    });
  });

  context('when requestContext emit error event', function() {
    let promise;
    const error = new Error('mock error');
    before(function(done) {
      httpHelper.process(afterhandlerJob).then(function(res) {
        promise = res;
        done();
      }).catch(function(err) {
        promise = err;
        done();
      });
      requestContext.emit('error', 'request', error);
    });
    after(function() {
    });
    it('should reject with Error', function() {
      expect(promise).to.equal(error);
    });
  });
});
