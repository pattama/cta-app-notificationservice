'use strict';

const ServerMock = require('mock-http-server');
const server = new ServerMock({
  host: 'localhost',
  port: 9000,
});
server.start(() => {
  console.log('Started mock server');
});
['GET', 'POST', 'PUT', 'DELETE'].forEach((method) => {
  server.on({
    method: method,
    path: '/api',
    reply: {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ method: method }),
    },
  });
});
