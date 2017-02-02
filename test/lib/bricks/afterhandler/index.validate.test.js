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

describe('AfterHandler - validate', function() {
  context('when everything ok', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'afterhandler',
        quality: 'mockprovider',
      },
      payload: {},
    };
    const context = { data: job };
    let mockValidate;
    const mockValidateResponse = { ok: 1 };
    let validatePromise;
    before(function(done) {
      afterHandler = new AfterHandler({}, config);
      sinon.spy(afterHandler.providers, 'has');
      mockValidate = sinon.stub().resolves(mockValidateResponse);
      afterHandler.providers.set('mockprovider', {
        validate: mockValidate,
      });

      afterHandler.validate(context).then(function(response) {
        validatePromise = response;
        done();
      }).catch(done);
    });
    after(function() {
      afterHandler.providers.has.restore();
    });

    it('should check provider is available', function() {
      expect(afterHandler.providers.has.calledWithExactly(job.nature.quality)).to.equal(true);
    });

    it('should call provider specific validate()', function() {
      expect(mockValidate.calledWith(job)).to.equal(true);
    });

    it('should resolve', function() {
      expect(validatePromise).to.be.an('object')
        .and.to.have.property('ok', 1);
    });
  });

  context('when job type is not supported', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'notafterhandler',
        quality: 'foobar',
      },
      payload: {},
    };
    const context = { data: job };
    before(function() {
      afterHandler = new AfterHandler({}, config);
    });

    it('should reject an error', function() {
      const validatePromise = afterHandler.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'type ' + job.nature.type + ' not supported');
    });
  });

  context('when job quality is not supported', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'afterhandler',
        quality: 'notasupportedquality',
      },
      payload: {},
    };
    const context = { data: job };
    before(function() {
      afterHandler = new AfterHandler({}, config);
      sinon.stub(afterHandler.providers, 'get').withArgs(job.nature.quality).returns(false);
    });
    after(function() {
      afterHandler.providers.get.restore();
    });

    it('should reject with an error', function() {
      const validatePromise = afterHandler.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'quality ' + job.nature.quality + ' not supported');
    });
  });

  context('when provider specific validation fails', function() {
    let afterHandler;
    const job = {
      nature: {
        type: 'afterhandler',
        quality: 'mockprovider',
      },
      payload: {},
    };
    const context = { data: job };
    let mockValidate;
    const mockValidateError = new Error('mock validate');
    before(function() {
      afterHandler = new AfterHandler({}, config);
      mockValidate = sinon.stub().rejects(mockValidateError);
      afterHandler.providers.set('mockprovider', {
        validate: mockValidate,
      });
    });

    it('should reject an error', function() {
      const validatePromise = afterHandler.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(mockValidateError);
    });
  });
});
