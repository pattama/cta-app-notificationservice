'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');
const _ = require('lodash');

const EmailHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/email', 'emailhelper'));
const afterhandlerJob = require('./job.afterhandler.email.sample.testdata.js');

describe('AfterHandler - Email - EmailHelper - validate', function() {
  context('when missing/incorrect \'template\' String property in job payload', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.template = {};
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'template\' String property in job payload');
    });
  });

  context('when job.payload.template is not supported by Email AfterHandler', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.template = 'not-a-supported-template';
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, `template '${job.payload.template}' is not supported`);
    });
  });

  context('when missing/incorrect \'data\' Object property in job payload', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.data = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'data\' Object property in job payload');
    });
  });

  context('when missing/incorrect \'subject\' String property in job payload data', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.data.subject = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'missing/incorrect \'subject\' String property in job payload data');
    });
  });

  context('when missing/incorrect \'mailerConfiguration\' Object property in job payload', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'missing/incorrect \'mailerConfiguration\' Object property in job payload');
    });
  });

  context('when missing/incorrect \'from\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.from = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'missing/incorrect \'from\' String property in job payload mailerConfiguration');
    });
  });

  context('when missing/incorrect \'to\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.to = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'missing/incorrect \'to\' String property in job payload mailerConfiguration');
    });
  });

  context('when missing/incorrect \'smtpServer\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.smtpServer = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'missing/incorrect \'smtpServer\' String property in job payload mailerConfiguration');
    });
  });

  context('when incorrect \'cc\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.cc = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'incorrect \'cc\' String property in job payload mailerConfiguration');
    });
  });

  context('when incorrect \'ignoreTLS\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.ignoreTLS = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'incorrect \'ignoreTLS\' Boolean property in job payload mailerConfiguration');
    });
  });

  context('when incorrect \'debug\' String property in job payload mailerConfiguration', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should reject with an error', function() {
      const job = _.cloneDeep(afterhandlerJob);
      job.payload.mailerConfiguration.debug = null;
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error,
        'incorrect \'debug\' Boolean property in job payload mailerConfiguration');
    });
  });

  context('when all properties are valid', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      templates.set('a-template', {});
      emailHelper = new EmailHelper(templates);
    });

    it('should resolve', function() {
      const job = _.cloneDeep(afterhandlerJob);
      const validatePromise = emailHelper.validate(job);
      return expect(validatePromise).to.eventually.have.property('ok', 1);
    });
  });
});
