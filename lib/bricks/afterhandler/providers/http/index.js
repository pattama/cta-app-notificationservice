'use strict';

const defaultLogger = require('cta-logger');
const HttpHelper = require('./httphelper');

/**
 * Http AfterHandler provider class
 * @class
 * @property {HttpHelper} httpHelper - instance of HttpHelper
 * @property {Object} configuration - configuration properties
 * @property {Logger} logger - instance of cta-logger
 * @property {Map<Template>} templates - Map of compiled ejs templates
 */
class Http {
  /**
   * Create a new Http AfterHandler instance
   * Load all ejs templates from the templates directory
   * @param {Object} configuration - configuration for the Http AfterHandler
   * @param {Logger} [logger] - cta-logger instance
   */
  constructor(configuration, logger) {
    this.logger = logger || defaultLogger();

    this._configure(configuration);

    this.httpHelper = new HttpHelper();
  }

  /**
   * Validate and set configuration properties
   * @param {Object} configuration - configuration for the Http AfterHandler
   * @private
   */
  _configure(configuration) { // eslint-disable-line no-unused-vars
    this.configuration = {};
  }

  /**
   * Validates Job properties specific to AfterHandler Http
   * @method
   * @instance
   * @param {Job} job - input job
   * @param {String} job.payload.method - method
   * @param {String} job.payload.url - url
   * @param {Object} [job.payload.headers] - optional headers
   * @param {Boolean} [job.payload.json] - whether body and response should be json
   * @param {Array<Number>} [job.payload.returncodes] - Array of accepted return codes
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  get validate() {
    return this.httpHelper.validate;
  }

  /**
   * Process an afterhandler-http job
   * @param {Job} job - input job
   * @param {String} job.payload.method - method
   * @param {String} job.payload.url - url
   * @param {Object} [job.payload.headers] - optional headers
   * @param {Boolean} [job.payload.json] - whether body and response should be json
   * @param {Array<Number>} [job.payload.returncodes] - Array of accepted return codes
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  process(job) {
    return this.httpHelper.process(job);
  }
}

exports = module.exports = Http;
