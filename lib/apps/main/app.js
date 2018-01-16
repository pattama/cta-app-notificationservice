/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

const path = require('path');
const FlowControl = require('cta-flowcontrol');
const config = require('./config/');
const Cement = FlowControl.Cement;
const cement = new Cement(config, path.join(__dirname, '..', '..'));

module.exports = cement;
