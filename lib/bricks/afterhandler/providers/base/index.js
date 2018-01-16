/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

/**
 * Base AfterHandler provider class
 * @class
 * @property {BaseHelper} httpHelper - instance of HttpHelper
 * @property {Object} configuration - configuration properties
 * @property {Logger} logger - instance of cta-logger
 */
class Base {
  /**
   * Create a new Http AfterHandler instance
   * Load all ejs templates from the templates directory
   * @param {Object} configuration - configuration for the Http AfterHandler
   * @param {Logger} [logger] - cta-logger instance
   */
  constructor(cementHelper, logger, configuration) {
    this.cementHelper = cementHelper;

    this.logger = logger;

    this.configuration = configuration;
  }
}

exports = module.exports = Base;
