'use strict';

const afterhandlerJob = {
  nature: {
    type: 'afterhandler',
    quality: 'http',
  },
  payload: {
    method: 'POST',
    url: 'http://localhost:3000/api/',
    headers: {},
    json: true,
    body: {},
    returncodes: [200],
  },
};

module.exports = afterhandlerJob;
