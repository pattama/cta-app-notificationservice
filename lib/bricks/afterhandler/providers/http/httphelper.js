'use strict';

const _ = require('lodash');
const BaseHelper = require('../base/basehelper.js');

/**
 * HttpHelper class
 * @class
 */
class HttpHelper extends BaseHelper {
  /**
   * Validates Job properties specific to AfterHandler Http
   * @param {Job} job - input job
   * @param {String} job.payload.method - method
   * @param {String} job.payload.url - url
   * @param {Object} [job.payload.headers] - optional headers
   * @param {Boolean} [job.payload.json] - whether body and response should be json
   * @param {Array<Number>} [job.payload.returncodes] - Array of accepted return codes
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  validate(job) {
    return new Promise((resolve, reject) => {
      if (!job.payload.hasOwnProperty('method') || (typeof job.payload.method !== 'string')) {
        reject(new Error('missing/incorrect \'method\' String property in job payload'));
      }

      if (!job.payload.hasOwnProperty('url') || (typeof job.payload.url !== 'string')) {
        reject(new Error('missing/incorrect \'url\' String property in job payload'));
      }

      if (job.payload.hasOwnProperty('headers')) {
        if ((typeof job.payload.headers !== 'object') || job.payload.headers === null) {
          reject(new Error('incorrect \'headers\' Object property in job payload'));
        }
      }

      if (job.payload.hasOwnProperty('json') && (typeof job.payload.json !== 'boolean')) {
        reject(new Error('incorrect \'json\' Boolean property in job payload'));
      }

      if (!job.payload.hasOwnProperty('returncodes') || !Array.isArray(job.payload.returncodes)) {
        reject(new Error('incorrect \'returncodes\' Array property in job payload'));
      }

      resolve({ ok: 1 });
    });
  }

  /**
   * Create a new HTTP request using job payload
   * @param {Job} job - input job
   * @param {String} job.payload.method - method
   * @param {String} job.payload.url - url
   * @param {Object} [job.payload.headers] - optional headers
   * @param {Boolean} [job.payload.json] - whether body and response should be json
   * @param {Array<Number>} [job.payload.returncodes] - Array of accepted return codes
   * @returns {Promise<Object>} - { ok: 0|1 }
   */
  process(job) {
    const that = this;
    const payload = _.pick(job.payload, ['method', 'url', 'headers', 'body']);
    return new Promise((resolve, reject) => {
      const requestJob = {
        nature: {
          type: 'request',
          quality: 'exec',
        },
        payload: payload,
      };

      const requestContext = that.cementHelper.createContext(requestJob);
      requestContext.once('done', function(brickname, response) {
        if (job.payload.returncodes.indexOf(response.status) !== -1) {
          resolve(response);
        } else {
          reject(new Error(`unexpected HTTP status code ${response.status}`));
        }
      });
      requestContext.once('reject', function(brickname, rejection) {
        reject(rejection);
      });
      requestContext.once('error', function(brickname, error) {
        reject(error);
      });
      requestContext.publish();
    });
  }
}

module.exports = HttpHelper;
