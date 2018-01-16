/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';

module.exports = {
  name: 'afterhandler',
  module: './bricks/afterhandler/index.js', // relative to Cement.dirname value (process.cwd() by default, i.e. where the app was launched)
  properties: {},
  publish: [
    {
      topic: 'io.message.acknowledge',
      data: [
        {
          nature: {
            type: 'messages',
            quality: 'acknowledge',
          },
        },
      ],
    },
    {
      topic: 'requests.com',
      data: [
        {
          nature: {
            type: 'request',
            quality: 'exec',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'get',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'delete',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'post',
          },
        },
        {
          nature: {
            type: 'request',
            quality: 'put',
          },
        },
      ],
    },
  ],
  subscribe: [
    {
      topic: 'afterhandler',
      data: [
        {
          nature: {
            type: 'afterhandler',
            quality: 'email',
          },
        },
        {
          nature: {
            type: 'afterhandler',
            quality: 'http',
          },
        },
      ],
    },
  ],
};
