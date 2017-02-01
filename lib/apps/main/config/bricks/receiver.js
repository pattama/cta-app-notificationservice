'use strict';

module.exports = {
  name: 'receiver',
  module: 'cta-io',
  dependencies: {
    messaging: 'messaging',
  },
  properties: {
    input: {
      queue: 'cta.nos.notifications',
    },
  },
  publish: [
    {
      topic: 'silo',
      data: [
        {
          nature: {
            type: 'documents',
            quality: 'backup',
          },
        },
        {
          nature: {
            type: 'documents',
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
            type: 'messages',
            quality: 'acknowledge',
          },
        },
      ],
    },
  ],
};
