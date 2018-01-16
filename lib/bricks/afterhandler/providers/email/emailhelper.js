/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const nodemailer = require('nodemailer');
const smtppool = require('nodemailer-smtp-pool');
const BaseHelper = require('../base/basehelper.js');

/**
 * EmailHelper class
 * @class
 */
class EmailHelper extends BaseHelper {
  /**
   * Create a new EmailHelper instance
   * @param {Map<Template>} templates - a Map of compiled ejs templates
   */
  constructor(cementHelper, logger, configuration, templates) {
    super(cementHelper, logger, configuration);

    if (Object.prototype.toString.call(templates) !== '[object Map]') {
      throw new Error('missing/incorrect \'templates\' Map argument');
    } else {
      this.templates = templates;
    }
  }

  /**
   * Validates Job properties specific to AfterHandler Email
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
  validate(job) {
    return new Promise((resolve, reject) => {
      if (!job.payload.hasOwnProperty('template') || (typeof job.payload.template !== 'string')) {
        reject(new Error('missing/incorrect \'template\' String property in job payload'));
      } else if (!this.templates.has(job.payload.template)) {
        reject(new Error(`template '${job.payload.template}' is not supported`));
      }

      if (!job.payload.hasOwnProperty('data') || (typeof job.payload.data !== 'object') || job.payload.data === null) {
        reject(new Error('missing/incorrect \'data\' Object property in job payload'));
      } else if (!job.payload.data.hasOwnProperty('subject') || typeof job.payload.data.subject !== 'string') {
        throw new Error('missing/incorrect \'subject\' String property in job payload data');
      }

      if (!job.payload.hasOwnProperty('mailerConfiguration')
        || typeof job.payload.mailerConfiguration !== 'object'
        || job.payload.mailerConfiguration === null) {
        throw new Error('missing/incorrect \'mailerConfiguration\' Object property in job payload');
      } else {
        if (!job.payload.mailerConfiguration.hasOwnProperty('from') || typeof job.payload.mailerConfiguration.from !== 'string') {
          throw new Error('missing/incorrect \'from\' String property in job payload mailerConfiguration');
        }

        if (!job.payload.mailerConfiguration.hasOwnProperty('to') || typeof job.payload.mailerConfiguration.to !== 'string') {
          throw new Error('missing/incorrect \'to\' String property in job payload mailerConfiguration');
        }

        if (!job.payload.mailerConfiguration.hasOwnProperty('smtpServer') || typeof job.payload.mailerConfiguration.smtpServer !== 'string') {
          throw new Error('missing/incorrect \'smtpServer\' String property in job payload mailerConfiguration');
        }

        if (job.payload.mailerConfiguration.hasOwnProperty('cc') && typeof job.payload.mailerConfiguration.cc !== 'string') {
          throw new Error('incorrect \'cc\' String property in job payload mailerConfiguration');
        }

        if (job.payload.mailerConfiguration.hasOwnProperty('ignoreTLS') && typeof job.payload.mailerConfiguration.ignoreTLS !== 'boolean') {
          throw new Error('incorrect \'ignoreTLS\' Boolean property in job payload mailerConfiguration');
        }

        if (job.payload.mailerConfiguration.hasOwnProperty('debug') && typeof job.payload.mailerConfiguration.debug !== 'boolean') {
          throw new Error('incorrect \'debug\' Boolean property in job payload mailerConfiguration');
        }
      }
      resolve({ ok: 1 });
    });
  }

  /**
   * Render an HTML string from Job properties using EJS template
   * @method
   * @param {Job} job - input job
   * @returns {Promise<String>} the rendered HTML string
   */
  render(job) {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      const template = this.templates.get(job.payload.template);
      const rendered = template(job.payload.data);
      resolve(rendered);
    });
  }

  /**
   * Send a rendered HTML content using mail service
   * @method
   * @param {String} subject - the subject of the mail
   * @param {String} content - the rendered HTML string
   * @param {Object} configuration - the configuration parameters for the mailer
   * @returns {Promise<String>} the response of the mail service
   */
  send(subject, content, configuration) {
    return new Promise((resolve, reject) => {
      const smtpPool = smtppool({
        host: configuration.smtpServer,
        ignoreTLS: configuration.ignoreTLS || true,
        debug: configuration.debug || false,
      });
      const transport = nodemailer.createTransport(smtpPool);
      transport.sendMail({
        from: configuration.from,
        to: configuration.to,
        cc: configuration.cc,
        subject: subject,
        html: content,
      }, function(error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

exports = module.exports = EmailHelper;
