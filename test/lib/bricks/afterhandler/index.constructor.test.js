'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const fs = require('fs');
const sinon = require('sinon');
require('sinon-as-promised');
const mockrequire = require('mock-require');
const nodepath = require('path');

const AfterHandler = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/', 'index.js'));
const config = {
  name: 'afterhandler',
  module: '../../lib/index',
  properties: {},
  publish: [],
};

describe('AfterHandler - constructor', function() {
  context('when everything ok', function() {
    const mockProviders = new Map();
    let afterHandler;
    before(function() {
      // create some mock providers
      // provider mock #1
      mockProviders.set('providerone', {
        MockConstructor: function() {
          return {
            providerone: 1,
          };
        },
      });
      sinon.spy(mockProviders.get('providerone'), 'MockConstructor');
      mockrequire(
        nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/providerone'),
        mockProviders.get('providerone').MockConstructor);
      // provider mock #2
      mockProviders.set('providertwo', {
        MockConstructor: function() {
          return {
            providertwo: 1,
          };
        },
      });
      sinon.spy(mockProviders.get('providertwo'), 'MockConstructor');
      mockrequire(
        nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/providertwo'),
        mockProviders.get('providertwo').MockConstructor);

      // stub fs readdirSync method
      // returns Array of mocked providers directories
      sinon.stub(fs, 'readdirSync').returns(Array.from(mockProviders.keys()));

      afterHandler = new AfterHandler({}, config);
    });

    after(function() {
      mockrequire.stopAll();
      fs.readdirSync.restore();
    });

    it('should list content of the providers directory', function() {
      return expect(fs.readdirSync.calledWith(sinon.match('providers'))).to.equal(true);
    });

    it('should instantiate a new provider instance per loaded provider', function() {
      mockProviders.forEach((value, key) => {
        expect(value.MockConstructor.called).to.equal(true);
        expect(afterHandler.providers.has(key)).to.equal(true);
        expect(afterHandler.providers.get(key)).to.equal(value.MockConstructor.returnValues[0]);
      });
    });

    it('should finally be an instance of AfterHandler', function() {
      return expect(afterHandler).to.be.an.instanceof(AfterHandler);
    });
  });

  context('when listing providers directory (fs.readdirSync) throws error', function() {
    const mockReaddirSyncError = new Error('mock fs readdirSync error');
    before(function() {
      // stub fs readdirSync method
      // throws an error
      sinon.stub(fs, 'readdirSync').throws(mockReaddirSyncError);
    });

    after(function() {
      fs.readdirSync.restore();
    });

    it('should throw a fs error', function() {
      return expect(function() {
        return new AfterHandler({}, config);
      }).to.throw(Error, 'loading providers failed: ' + mockReaddirSyncError.message);
    });
  });

  context('when requiring a provider (nodejs require()) throws error', function() {
    // todo: don't know how to stub require() yet
  });

  context('when instantiating a provider (new Provider()) throws error', function() {
    const mockProviders = new Map();
    const mockProviderError = new Error('mock provider error at instantiation');
    before(function() {
      // create some mock providers
      // provider mock #1 throws error
      mockProviders.set('providerone', {
        MockConstructor: function() {
          throw mockProviderError;
        },
      });
      sinon.spy(mockProviders.get('providerone'), 'MockConstructor');
      mockrequire(
        nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/providerone'),
        mockProviders.get('providerone').MockConstructor);

      // stub fs readdirSync method
      // returns Array of mocked providers directories
      sinon.stub(fs, 'readdirSync').returns(Array.from(mockProviders.keys()));
    });

    after(function() {
      mockrequire.stopAll();
      fs.readdirSync.restore();
    });

    it('should throw a provider instantiation error', function() {
      return expect(function() {
        return new AfterHandler({}, config);
      }).to.throw(Error, 'loading providers failed: ' + mockProviderError.message);
    });
  });
});
