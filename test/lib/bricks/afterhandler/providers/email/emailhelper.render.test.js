'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');
const ejs = require('ejs');

const EmailHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/email', 'emailhelper'));

describe('AfterHandler - Email - EmailHelper - render', function() {
  context('ejs template rendering fails', function() {
    let emailHelper;
    const templates = new Map();
    let job;
    let template;
    const renderingError = new Error('mock error');
    before(function() {
      template = {
        name: 'a-failing-template',
        compiled: function() {
          throw renderingError;
        },
      };
      templates.set(template.name, template.compiled);
      emailHelper = new EmailHelper(templates);
      job = {
        nature: {
          type: 'AfterHandler',
          quality: 'Email',
        },
        payload: {
          template: 'a-failing-template',
          data: {
            name: 'world',
          },
        },
      };
    });

    it('should reject', function() {
      const renderPromise = emailHelper.render(job);
      return expect(renderPromise).to.eventually.be.rejectedWith(renderingError);
    });
  });

  context('ejs template rendering succeeds', function() {
    let emailHelper;
    const templates = new Map();
    let job;
    let template;
    before(function() {
      template = {
        name: 'a-template',
        compiled: ejs.compile('hello <%= name %>'),
      };
      templates.set(template.name, template.compiled);
      emailHelper = new EmailHelper(templates);
      job = {
        nature: {
          type: 'AfterHandler',
          quality: 'Email',
        },
        payload: {
          template: 'a-template',
          data: {
            name: 'world',
          },
        },
      };
    });

    it('should resolve with a rendered string', function() {
      const renderPromise = emailHelper.render(job);
      return expect(renderPromise).to.eventually.equal('hello world');
    });
  });
});
