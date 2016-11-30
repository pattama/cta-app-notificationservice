'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const EmailHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/email', 'emailhelper'));

describe('AfterHandler - Email - EmailHelper - constructor', function() {
  context('when missing/incorrect \'templates\' Map argument', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new EmailHelper({});
      }).to.throw(Error, 'missing/incorrect \'templates\' Map argument');
    });
  });

  context('when arguments are valid', function() {
    let emailHelper;
    const templates = new Map();
    before(function() {
      emailHelper = new EmailHelper(templates);
    });
    it('should return an EmailHelper instance', function() {
      expect(emailHelper).to.be.an.instanceof(EmailHelper)
        .and.to.have.property('templates', templates);
    });
  });
});
