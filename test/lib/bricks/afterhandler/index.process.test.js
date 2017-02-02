'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const nodepath = require('path');

const AfterHandler = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/', 'index.js'));
const config = {
  name: 'afterhandler',
  module: '../../lib/index',
  properties: {},
  publish: [],
};

describe('AfterHandler - process', function() {
  context('when provider process() resolves', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'afterhandler',
        quality: 'mockprovider',
      },
      payload: {},
    };
    const context = { data: job };
    let mockContextEmit;
    let mockProcess;
    const mockProcessResponse = { ok: 1 };
    before(function() {
      afterHandler = new AfterHandler({}, config);
      afterHandler.name = 'afterhandler';
      mockContextEmit = sinon.stub();
      context.emit = mockContextEmit;
      mockProcess = sinon.stub().resolves(mockProcessResponse);
      afterHandler.providers.set('mockprovider', {
        process: mockProcess,
      });

      afterHandler.process(context);
    });

    it('should call provider specific process()', function() {
      expect(mockProcess.calledWith(job)).to.equal(true);
    });

    it('should emit done event on context', function() {
      const response = {
        ok: 1,
        job: job,
        response: mockProcessResponse,
      };
      expect(context.emit.calledWith('done', afterHandler.name, response)).to.equal(true);
    });
  });

  context('when provider process() rejects', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'afterhandler',
        quality: 'mockprovider',
      },
      payload: {},
    };
    const context = { data: job };
    let mockContextEmit;
    let mockProcess;
    const mockProcessError = new Error('mock process error');
    before(function() {
      afterHandler = new AfterHandler({}, config);
      afterHandler.name = 'afterhandler';
      mockContextEmit = sinon.stub();
      context.emit = mockContextEmit;
      mockProcess = sinon.stub().rejects(mockProcessError);
      afterHandler.providers.set('mockprovider', {
        process: mockProcess,
      });

      afterHandler.process(context);
    });

    it('should call provider specific process()', function() {
      expect(mockProcess.calledWith(job)).to.equal(true);
    });

    it('should emit error event on context', function() {
      const response = {
        ok: 0,
        job: job,
        error: mockProcessError,
      };
      expect(context.emit.calledWith('error', afterHandler.name, response)).to.equal(true);
    });
  });
});
