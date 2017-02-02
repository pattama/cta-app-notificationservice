'use strict';

const Messaging = require('cta-messaging');

const sqr = new Messaging();
const queue = 'cta.notifications';
const job = {
  nature: {
    type: 'afterhandler',
    quality: 'email',
  },
  payload: {
    template: 'test-report',
    data: {
      subject: 'oss - notification service - email',
      name: 'song an',
    },
    mailerConfiguration: {
      from: 'songan.bui@thomsonreuters.com',
      to: 'songan.bui@thomsonreuters.com',
      smtpServer: 'mailhub.tfn.com',
      cc: 'songan.bui@thomsonreuters.com',
      ignoreTLS: true,
      debug: false,
    },
  },
};

sqr.produce({
  queue: queue,
  json: job,
}).then(function(response) {
  console.log('response: ', response);
}, function(err) {
  console.error('error: ', err);
});
