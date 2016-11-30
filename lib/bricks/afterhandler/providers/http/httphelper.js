'use strict';

const request = require('request');
const _ = require('lodash');

/**
 * HttpHelper class
 * @class
 */
class HttpHelper {
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
    const options = _.cloneDeep(job.payload);
    delete options.returncodes;
    return new Promise((resolve, reject) => {
      request(options, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          const result = {
            statuscode: response.statusCode,
          };
          if (job.payload.returncodes.indexOf(response.statusCode) !== -1) {
            result.ok = 1;
          } else {
            result.ok = 0;
          }
          if (body) result.body = body;
          resolve(result);
        }
      });
    });
  }
}

module.exports = HttpHelper;
