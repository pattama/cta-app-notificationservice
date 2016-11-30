'use strict';

const appRootPath = require('cta-common').root('cta-app-notificationservice');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const nodepath = require('path');

const HttpHelper = require(nodepath.join(appRootPath,
  '/lib/bricks/afterhandler/providers/http', 'httphelper'));

describe('AfterHandler - Http - HttpHelper - constructor', function() {
  context('when arguments are valid', function() {
    let httpHelper;
    before(function() {
      httpHelper = new HttpHelper();
    });
    it('should return an EmailHelper instance', function() {
      expect(httpHelper).to.be.an.instanceof(HttpHelper);
    });
  });
});
