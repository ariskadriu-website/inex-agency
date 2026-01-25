// Re-export the handler from server.js
const server = require('../server');
module.exports.handler = server.handler;
