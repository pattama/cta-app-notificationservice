'use strict';

module.exports = {
  name: 'requestbrick',
  module: 'cta-brick-request',
  dependencies: {
    request: 'requesttool',
  },
  properties: {},
  subscribe: [
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
};
