'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

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
const afterhandlerJob = require('./job.afterhandler.http.sample.testdata.js');

describe('AfterHandler - Http - HttpHelper - validate', function() {
  let httpHelper;
  before(function() {
    httpHelper = new HttpHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });
  context('when all properties are valid', function() {
    it('should resolve', function() {
      const job = _.cloneDeep(afterhandlerJob);
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.have.property('ok', 1);
    });
  });

  context('when missing/incorrect \'method\' String property in job payload', function() {
    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.method = {};
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'method\' String property in job payload');
    });
  });

  context('when missing/incorrect \'method\' String property in job payload', function() {
    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.url = {};
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'url\' String property in job payload');
    });
  });

  context('when incorrect \'headers\' Object property in job payload', function() {
    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.headers = null;
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'incorrect \'headers\' Object property in job payload');
    });
  });

  // context('when incorrect \'body\' Object property in job payload', function() {
  //   it('should reject with an error', function() {
  //     const job = _.cloneDeep(afterhandlerJob);
  //     job.payload.body = null;
  //     const validatePromise = httpHelper.validate(job);
  //     return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'incorrect \'body\' Object property in job payload');
  //   });
  // });


  context('when incorrect \'json\' boolean property in job payload', function() {
    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.json = {};
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'incorrect \'json\' Boolean property in job payload');
    });
  });

  context('when incorrect \'returncodes\' Array property in job payload', function() {
    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.returncodes = {};
      const validatePromise = httpHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'incorrect \'returncodes\' Array property in job payload');
    });
  });
});
