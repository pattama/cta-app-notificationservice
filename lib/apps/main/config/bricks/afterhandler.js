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
            type: 'message',
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
