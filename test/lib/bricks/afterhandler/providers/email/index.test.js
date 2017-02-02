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

const fs = require('fs');
const ejs = require('ejs');

const Base = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'base'));
let Email = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers', 'email'));
const EmailHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/email', 'emailhelper'));
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

describe('AfterHandler - Email - constructor', function() {
  context('when everything ok', function() {
    let StubEmailHelper;
    let mockEmailHelperInstance;
    let email;
    const mockTemplates = new Map();
    before(function() {
      // mock templates path (key), content (value.content) and compiled template (value.compiled)
      mockTemplates.set('template-one.ejs', { content: '{{ hello }}', compiled: 'hello' });
      mockTemplates.set('template-two.ejs', { content: '{{ world }}', compiled: 'world' });

      // stubing and spying the EmailHelper Class required in Email class
      // returns a mocked EmailHelper
      mockEmailHelperInstance = new EmailHelper(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, new Map());
      StubEmailHelper = sinon.stub().returns(mockEmailHelperInstance);
      requireSubvert.subvert(
        nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/email/emailhelper'),
        StubEmailHelper);
      Email = requireSubvert.require(
        nodepath.join(appRootPath, '/lib/bricks/afterhandler/providers/email'));

      // stub fs readdirSync method
      // returns Array of mocked templates paths
      sinon.stub(fs, 'readdirSync').returns(Array.from(mockTemplates.keys()));

      // stub fs readFileSync method
      // returns mocked template content per template path
      sinon.stub(fs, 'readFileSync', function(path) {
        let content;
        mockTemplates.forEach((value, key) => {
          if (path.indexOf(key) !== -1) {
            content = value.content;
          }
        });
        return content;
      });

      // stub ejs compile method
      // returns mocked compiled template per template content
      sinon.stub(ejs, 'compile', function(content) {
        let compiled;
        mockTemplates.forEach((value) => {
          if (content === value.content) {
            compiled = value.compiled;
          }
        });
        return compiled;
      });

      email = new Email(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
    });

    after(function() {
      requireSubvert.cleanUp();
      fs.readdirSync.restore();
      fs.readFileSync.restore();
      ejs.compile.restore();
    });

    it('should extend Base Provider', function() {
      expect(Object.getPrototypeOf(Email)).to.equal(Base);
    });

    it('should be a new AfterHandler Email instance', function() {
      expect(email).to.be.an.instanceOf(Email);
    });

    describe('_configure', function() {
      it('should have a configuration object', function() {
        expect(email).to.have.property('configuration')
          .and.to.be.an('object');
      });
    });

    describe('_loadTemplates', function() {
      it('should list content of the templates directory', function() {
        expect(fs.readdirSync.calledWith(sinon.match('templates'))).to.equal(true);
      });

      it('should load ejs files of the templates directory', function() {
        mockTemplates.forEach((value, key) => {
          expect(fs.readFileSync.calledWith(sinon.match(key))).to.equal(true);
        });
      });

      it('should compile the loaded ejs files', function() {
        mockTemplates.forEach((value, key) => { // eslint-disable-line no-unused-vars
          expect(ejs.compile.calledWith(value.content)).to.equal(true);
        });
      });

      it('should have a Map of compiled ejs templates', function() {
        expect(email).to.have.property('templates')
          .and.to.be.a('Map');
        mockTemplates.forEach((value, key) => {
          const keyNoFileExt = key.slice(0, -4);
          expect(email.templates.has(keyNoFileExt)).to.equal(true);
          expect(email.templates.get(keyNoFileExt)).to.equal(value.compiled);
        });
      });
    });

    it('should have a EmailHelper instance', function() {
      expect(StubEmailHelper.calledWithExactly(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration, email.templates)).to.equal(true);
      expect(email).to.have.property('emailHelper').and.to.be.an.instanceof(EmailHelper);
      expect(email.emailHelper).to.equal(mockEmailHelperInstance);
    });
  });

  describe('errors at _configure', function() {});

  describe('errors at _loadTemplates', function() {
    context('when listing templates directory (fs.readdirSync) throws error', function() {
      const templates = new Map();
      const error = new Error('readdirSync error');
      before(function() {
        templates.set('template-one.ejs', { template: '{{ hello }}', render: 'hello' });
        templates.set('template-two.ejs', { template: '{{ world }}', render: 'world' });

        sinon.stub(fs, 'readdirSync').throws(error);
      });

      after(function() {
        fs.readdirSync.restore();
      });

      it('should throw an error', function() {
        return expect(function() {
          return new Email(configuration, DEFAULTLOGGER);
        }).to.throw(Error, 'instantiating Email templates failed: ' + error.message);
      });
    });

    context('when template files extension is not .ejs', function() {
      let email; // eslint-disable-line no-unused-vars
      const templates = new Map();
      before(function() {
        templates.set('template-one.xxxxx', { template: '{{ hello }}', render: 'hello' });
        templates.set('template-two.pdf', { template: '{{ hello }}', render: 'hello' });

        sinon.stub(fs, 'readdirSync', function() {
          return Array.from(templates.keys());
        });

        sinon.spy(DEFAULTLOGGER, 'warn');
        email = new Email(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
      });

      after(function() {
        fs.readdirSync.restore();
        DEFAULTLOGGER.warn.restore();
      });

      it('should warn that template file extension is not supported', function() {
        templates.forEach((value, key) => {
          const warnMsg = `could not load Email template '${key}'. File extension not supported.`;
          expect(DEFAULTLOGGER.warn.calledWithExactly(warnMsg)).to.equal(true);
        });
      });
    });

    context('when loading template file throws error', function() {
      const templates = new Map();
      const error = new Error('readFileSync error');
      before(function() {
        templates.set('template-one.ejs', { template: '{{ hello }}', render: 'hello' });
        templates.set('template-two.ejs', { template: '{{ world }}', render: 'world' });

        sinon.stub(fs, 'readdirSync').returns(Array.from(templates.keys()));

        sinon.stub(fs, 'readFileSync').throws(error);
      });

      after(function() {
        fs.readdirSync.restore();
        fs.readFileSync.restore();
      });

      it('should throw an error', function() {
        return expect(function() {
          return new Email(configuration, DEFAULTLOGGER);
        }).to.throw(Error, 'instantiating Email templates failed: ' + error.message);
      });
    });

    context('when compiling template throws error', function() {
      const templates = new Map();
      const error = new Error('ejs compile error');
      before(function() {
        templates.set('template-one.ejs', { template: '{{ hello }}', render: 'hello' });
        templates.set('template-two.ejs', { template: '{{ world }}', render: 'world' });

        sinon.stub(fs, 'readdirSync').returns(Array.from(templates.keys()));

        sinon.stub(fs, 'readFileSync', function(path) {
          let content;
          templates.forEach((value, key) => {
            if (path.indexOf(key) !== -1) {
              content = value.template;
            }
          });
          return content;
        });

        sinon.stub(ejs, 'compile').throws(error);
      });

      after(function() {
        fs.readdirSync.restore();
        fs.readFileSync.restore();
        ejs.compile.restore();
      });

      it('should throw an error', function() {
        return expect(function() {
          return new Email(configuration, DEFAULTLOGGER);
        }).to.throw(Error, 'instantiating Email templates failed: ' + error.message);
      });
    });
  });
});

describe('AfterHandler - Email - validate', function() {
  let email;
  before(function() {
    email = new Email(DEFAULTCEMENTHELPER, DEFAULTLOGGER, configuration);
  });

  describe('validate', function() {
    it('should return emailHelper.validate method', function() {
      expect(email.validate).to.be.equal(email.emailHelper.validate);
    });
  });
});
