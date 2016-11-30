'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const nodepath = require('path');

const Email = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'email'));

const configuration = require('./configuration.testdata.js');
const afterhandlerJob = require('./job.afterhandler.email.sample.testdata.js');

describe('AfterHandler - Email - process', function() {
  context('when everything ok', function() {
    let email;
    const mockRenderPromise = '<p>this is a mocked render</p>';
    const mockSendPromise = { ok: 1 };
    let processPromise;
    before(function() {
      email = new Email(configuration);
      sinon.stub(email.emailHelper, 'render').resolves(mockRenderPromise);
      sinon.stub(email.emailHelper, 'send').resolves(mockSendPromise);
      processPromise = email.process(afterhandlerJob);
    });

    after(function() {
      email.emailHelper.render.restore();
      email.emailHelper.send.restore();
    });

    it('should call emailHelper render', function() {
      return expect(email.emailHelper.render.calledWithExactly(afterhandlerJob)).to.equal(true);
    });

    it('should call emailHelper send', function() {
      return expect(email.emailHelper.send.calledWithExactly(
        afterhandlerJob.payload.data.subject,
        mockRenderPromise,
        afterhandlerJob.payload.mailerConfiguration)).to.equal(true);
    });

    it('should resolve with emailHelper send response', function() {
      return expect(processPromise).to.eventually.equal(mockSendPromise);
    });
  });

  context('when render fails', function() {
    let email;
    const mockRenderError = new Error('mock render error');
    const mockSendPromise = { ok: 1 };
    let processPromise;
    before(function() {
      email = new Email(configuration);
      sinon.stub(email.emailHelper, 'render').rejects(mockRenderError);
      sinon.stub(email.emailHelper, 'send').resolves(mockSendPromise);
      processPromise = email.process(afterhandlerJob);
    });

    after(function() {
      email.emailHelper.render.restore();
      email.emailHelper.send.restore();
    });

    it('should reject with render error', function() {
      return expect(processPromise).to.eventually.be.rejectedWith(mockRenderError);
    });
  });

  context('when send fails', function() {
    let email;
    const mockRenderPromise = '<p>this is a mocked render</p>';
    const mockSendError = new Error('mock send error');
    let processPromise;
    before(function() {
      email = new Email(configuration);
      sinon.stub(email.emailHelper, 'render').resolves(mockRenderPromise);
      sinon.stub(email.emailHelper, 'send').rejects(mockSendError);
      processPromise = email.process(afterhandlerJob);
    });

    after(function() {
      email.emailHelper.render.restore();
      email.emailHelper.send.restore();
    });

    it('should reject with send error', function() {
      return expect(processPromise).to.eventually.be.rejectedWith(mockSendError);
    });
  });
});
