'use strict';

module.exports = {
  name: 'receiver',
  module: 'cta-io',
  dependencies: {
    messaging: 'messaging',
  },
  properties: {
    input: {
      queue: 'cta.notifications',
    },
  },
  publish: [
    {
      topic: 'silo',
      data: [
        {
          nature: {
            type: 'document',
            quality: 'backup',
          },
        },
        {
          nature: {
            type: 'document',
            quality: 'restore',
          },
        },
      ],
    },
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
  subscribe: [
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
  ],
};
