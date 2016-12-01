'use strict';

const path = require('path');
const FlowControl = require('cta-flowcontrol');
const config = require('./config/');
const Cement = FlowControl.Cement;
const cement = new Cement(config, path.join(__dirname, '..', '..'));

module.exports = cement;
