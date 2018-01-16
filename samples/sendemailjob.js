'use strict';

const Messaging = require('cta-messaging');

const sqr = new Messaging();
const queue = 'cta.nos.notifications';
const execution = {
  "_id" : "58ca8b95fcd3dd0011ecb69a",
  "scenarioId" : "5848e4e4f6523cbab4d2d4e5",
  "userId" : "5848e4e4f6523cbab4d2d4e5",
  "requestTimestamp" : 1489669013389.0,
  "updateTimestamp" : 1489669013919.0,
  "completeTimestamp" : 1489669013928.0,
  "pendingTimeout" : 300000,
  "runningTimeout" : 300000,
  "pendingTimeoutScheduleId" : "58ca8b95cc1db70012c9433b",
  "result" : "failed",
  "ok" : 1,
  "partial" : 0,
  "inconclusive" : 0,
  "failed" : 1,
  "resultsCount" : 7,
  "instances" : [
    {
      "id" : "58ca815932ec190011517099",
      "hostname" : "agt-docker",
      "ip" : "172.25.0.4",
      "properties" : {
        "platform" : "linux",
        "hostname" : "agt-docker"
      },
      "executionId" : null,
      "state" : null
    }
  ],
  "commandsCount" : 1,
  "state" : "finished",
  "cancelDetails" : null
};
const job = {
  nature: {
    type: 'afterhandler',
    quality: 'email',
  },
  payload: {
    template: 'execution-report',
    data: {
      subject: 'oss - notification service - email',
      name: 'song an',
      execution,
    },
    mailerConfiguration: {
      from: 'kiettisak.angkanawin@thomsonreuters.com',
      to: 'kiettisak.angkanawin@thomsonreuters.com',
      smtpServer: 'mailhub.tfn.com',
      cc: 'kiettisak.angkanawin@thomsonreuters.com',
      ignoreTLS: true,
      debug: false,
    },
  },
};

sqr.produce({
  queue: queue,
  content: job,
}).then(function(response) {
  console.log('response: ', response);
}, function(err) {
  console.error('error: ', err);
});
