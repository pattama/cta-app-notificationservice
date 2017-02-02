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

const nodemailer = require('nodemailer');
const smtppool = require('nodemailer-smtp-pool');

const EmailHelperPath = nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/email/emailhelper');
let EmailHelper = require(EmailHelperPath);
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

const subject = 'TDD tests - AfterHandler - Email - send';
const content = `This is a <s>spam</s>test.</br> If you received this,
     it probably means the sendMail method has not been mocked properly...
     </br></br>or maybe it was on purpose? ;-)`;
const mailerConfiguration = {
  from: 'songan.bui@thomsonreuters.com',
  to: 'songan.bui@thomsonreuters.com',
  smtpServer: 'mailhub.tfn.com',
  cc: 'songan.bui@thomsonreuters.com',
  ignoreTLS: true,
  debug: false,
};
const smtpConfiguration = {
  host: mailerConfiguration.smtpServer,
  ignoreTLS: mailerConfiguration.ignoreTLS,
  debug: mailerConfiguration.debug,
};
const sendMailOptions = {
  from: mailerConfiguration.from,
  to: mailerConfiguration.to,
  cc: mailerConfiguration.cc,
  subject: subject,
  html: content,
};

describe('AfterHandler - Email - EmailHelper - send', function() {
  context('when everything ok', function() {
    let mockSmtpPool;
    let stubSmtpPoolModule;
    let mockTransport;
    const mockSendMailResponse = { ok: 1 };
    let emailHelper;
    const templates = new Map();
    let sendPromise;
    before(function() {
      // stubing the nodemailer-smpt-pool module (an exported method) required in EmailHelper class
      // returns a mocked smtppool
      mockSmtpPool = smtppool(smtpConfiguration);
      stubSmtpPoolModule = sinon.stub().returns(mockSmtpPool);
      requireSubvert.subvert('nodemailer-smtp-pool', stubSmtpPoolModule);
      EmailHelper = requireSubvert.require(EmailHelperPath);

      // stubing the nodemailer.createTransport method
      // returns a mocked transport
      mockTransport = nodemailer.createTransport(mockSmtpPool);
      sinon.stub(nodemailer, 'createTransport', function() {
        return mockTransport;
      });

      // stubing the mocked transport sendMail method
      // call the callback with a response
      sinon.stub(mockTransport, 'sendMail', function(options, callback) {
        callback(null, mockSendMailResponse);
      });

      emailHelper = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, templates);
      sendPromise = emailHelper.send(subject, content, mailerConfiguration);
    });

    after(function() {
      requireSubvert.cleanUp();
      nodemailer.createTransport.restore();
      mockTransport.sendMail.restore();
    });

    it('should create a new smtppool', function() {
      return expect(stubSmtpPoolModule.calledWithExactly(smtpConfiguration)).to.be.equal(true);
    });

    it('should create a new transport', function() {
      return expect(nodemailer.createTransport.calledWithExactly(mockSmtpPool)).to.be.equal(true);
    });

    it('should send mail using the transport', function() {
      return expect(mockTransport.sendMail.calledWith(sinon.match(sendMailOptions))).to.be.equal(true);
    });

    it('should resolve with sendMail response', function() {
      return expect(sendPromise).to.eventually.equal(mockSendMailResponse);
    });
  });

  context('when creating the SMTP pool fails', function() {
    let mockSmtpPoolError;
    let stubSmtpPoolModule;
    let emailHelper;
    const templates = new Map();
    let sendPromise;
    before(function() {
      // stubing the nodemailer-smpt-pool module (an exported method) required in EmailHelper class
      // returns an Error
      mockSmtpPoolError = new Error('mock smtppool error');
      stubSmtpPoolModule = sinon.stub().throws(mockSmtpPoolError);
      requireSubvert.subvert('nodemailer-smtp-pool', stubSmtpPoolModule);
      EmailHelper = requireSubvert.require(EmailHelperPath);

      emailHelper = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, templates);
      sendPromise = emailHelper.send(subject, content, mailerConfiguration);
    });

    after(function() {
      requireSubvert.cleanUp();
    });

    it('should reject with a smtppool error', function() {
      return expect(sendPromise).to.eventually.be.rejectedWith(mockSmtpPoolError);
    });
  });

  context('when creating the mail Transport fails', function() {
    let mockSmtpPool;
    let stubSmtpPoolModule;
    let mockTransportError;
    let emailHelper;
    const templates = new Map();
    let sendPromise;
    before(function() {
      // stubing the nodemailer-smpt-pool module (an exported method) required in EmailHelper class
      // returns a mocked smtppool
      mockSmtpPool = smtppool(smtpConfiguration);
      stubSmtpPoolModule = sinon.stub().returns(mockSmtpPool);
      requireSubvert.subvert('nodemailer-smtp-pool', stubSmtpPoolModule);
      EmailHelper = requireSubvert.require(EmailHelperPath);

      // stubing the nodemailer.createTransport method
      // returns an Error
      mockTransportError = new Error('mock createTransport error');
      sinon.stub(nodemailer, 'createTransport').throws(mockTransportError);

      emailHelper = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, templates);
      sendPromise = emailHelper.send(subject, content, mailerConfiguration);
    });

    after(function() {
      requireSubvert.cleanUp();
      nodemailer.createTransport.restore();
    });

    it('should reject with a createTransport error', function() {
      return expect(sendPromise).to.eventually.be.rejectedWith(mockTransportError);
    });
  });

  context('when sending the mail fails', function() {
    let mockSmtpPool;
    let stubSmtpPoolModule;
    let mockTransport;
    const mockSendMailError = new Error('mock sendMail error');
    let emailHelper;
    const templates = new Map();
    let sendPromise;
    before(function() {
      // stubing the nodemailer-smpt-pool module (an exported method) required in EmailHelper class
      // returns a mocked smtppool
      mockSmtpPool = smtppool(smtpConfiguration);
      stubSmtpPoolModule = sinon.stub().returns(mockSmtpPool);
      requireSubvert.subvert('nodemailer-smtp-pool', stubSmtpPoolModule);
      EmailHelper = requireSubvert.require(EmailHelperPath);

      // stubing the nodemailer.createTransport method
      // returns a mocked transport
      mockTransport = nodemailer.createTransport(mockSmtpPool);
      sinon.stub(nodemailer, 'createTransport', function() {
        return mockTransport;
      });

      // stubing the mocked transport sendMail method
      // call the callback with an Error
      sinon.stub(mockTransport, 'sendMail', function(options, callback) {
        callback(mockSendMailError, null);
      });

      emailHelper = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, templates);
      sendPromise = emailHelper.send(subject, content, mailerConfiguration);
    });

    after(function() {
      requireSubvert.cleanUp();
      nodemailer.createTransport.restore();
      mockTransport.sendMail.restore();
    });

    it('should reject with a sendMail error', function() {
      return expect(sendPromise).to.be.rejectedWith(mockSendMailError);
    });
  });
});
