'use strict';

const Messaging = require('cta-messaging');

const sqr = new Messaging();
const queue = 'cta.notifications';
const job = {
  nature: {
    type: 'afterhandler',
    quality: 'http',
  },
  payload: {
    url: 'http://localhost:9000/api',
    method: 'POST',
    body: { foo: 'bar' },
    returncodes: [200],
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
