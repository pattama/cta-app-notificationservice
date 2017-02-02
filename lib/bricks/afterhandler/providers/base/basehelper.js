'use strict';

/**
 * BaseHelper class
 * @class
 */
class BaseHelper {
  /**
   * Create a new Base instance
   */
  constructor(cementHelper, logger, configuration) {
    this.cementHelper = cementHelper;
    this.logger = logger;
    this.configuration = configuration;
  }

  /**
   * Validates Job properties
   * @param {Job} job - input job
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  validate(job) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
      reject(new Error('validate method not overriden by provider helper'));
    });
  }

  /**
   * Process Job
   * @param {Job} job - input job
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  process(job) { // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
      reject(new Error('process method not overriden by provider helper'));
    });
  }
}

module.exports = BaseHelper;
