'use strict';

const co = require('co');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Base = require('../base');
const EmailHelper = require('./emailhelper');

/**
 * Email AfterHandler provider class
 * @class
 * @property {EmailHelper} emailHelper - instance of EmailHelper
 * @property {Object} configuration - configuration properties
 * @property {Logger} logger - instance of cta-logger
 * @property {Map<Template>} templates - Map of compiled ejs templates
 */
class Email extends Base {
  /**
   * Create a new Email AfterHandler instance
   * Load all ejs templates from the templates directory
   * @param {Object} configuration - configuration for the Email AfterHandler
   * @param {Logger} [logger] - cta-logger instance
   */
  constructor(cementHelper, logger, configuration) {
    super(cementHelper, logger, configuration);

    this._loadTemplates();

    this.emailHelper = new EmailHelper(cementHelper, logger, configuration, this.templates);
  }

  /**
   * Import, load and compile ejs templates
   * @private
   */
  _loadTemplates() {
    this.templates = new Map();
    try {
      const templatesDirectory = path.join(__dirname, 'templates');
      const templatesFileNames = fs.readdirSync(templatesDirectory);
      templatesFileNames.forEach((filename) => {
        if (filename.endsWith('.ejs')) {
          const templateFilePath = path.join(templatesDirectory, filename);
          const templateContent = fs.readFileSync(templateFilePath, 'utf8');
          const compiledTemplate = ejs.compile(templateContent);
          const filenameNoExtension = filename.slice(0, -4);
          this.templates.set(filenameNoExtension, compiledTemplate);
        } else {
          this.logger.warn(`could not load Email template '${filename}'. File extension not supported.`);
        }
      });
    } catch (error) {
      throw new Error('instantiating Email templates failed: ' + error.message);
    }
  }

  /**
   * Validates Job properties specific to AfterHandler Email
   * @method
   * @instance
   * @param {Job} job - input job
   * @param {String} job.payload.template - name of an ejs template
   * @param {Object} job.payload.data - data object to use when rendering template
   * @param {Object} job.payload.mailerConfiguration - configuration object for sending mail
   * @param {String} job.payload.mailerConfiguration.from - mail address of the sender
   * @param {String} job.payload.mailerConfiguration.to - mail addresses of receivers
   * @param {String} job.payload.mailerConfiguration.cc - mail addresses of cc
   * @param {String} job.payload.mailerConfiguration.smtpServer - smtp server url
   * @param {Boolean} [job.payload.mailerConfiguration.ignoreTLS] - whether to ignore TLS
   * @param {Boolean} [job.payload.mailerConfiguration.debug] - whether to use send method in debug
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  get validate() {
    return this.emailHelper.validate;
  }

  /**
   * Process an AfterHandler-Email job
   * @param {Job} job - input job
   * @param {String} job.payload.template - name of an ejs template
   * @param {Object} job.payload.data - data object to use when rendering template
   * @param {Object} job.payload.mailerConfiguration - configuration object for sending mail
   * @param {String} job.payload.mailerConfiguration.from - mail address of the sender
   * @param {String} job.payload.mailerConfiguration.to - mail addresses of receivers
   * @param {String} job.payload.mailerConfiguration.cc - mail addresses of cc
   * @param {String} job.payload.mailerConfiguration.smtpServer - smtp server url
   * @param {Boolean} [job.payload.mailerConfiguration.ignoreTLS] - whether to ignore TLS
   * @param {Boolean} [job.payload.mailerConfiguration.debug] - whether to use send method in debug
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  process(job) {
    const that = this;
    return co(function* processCoroutine() {
      const rendered = yield that.emailHelper.render(job);
      const sendResponse = yield that.emailHelper.send(
        job.payload.data.subject,
        rendered,
        job.payload.mailerConfiguration);
      return sendResponse;
    });
  }
}

exports = module.exports = Email;
