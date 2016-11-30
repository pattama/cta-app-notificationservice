'use strict';

const afterhandlerJob = {
  nature: {
    type: 'afterhandler',
    quality: 'email',
  },
  payload: {
    template: 'a-template',
    data: {
      subject: 'tdd - email - process',
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

module.exports = afterhandlerJob;
