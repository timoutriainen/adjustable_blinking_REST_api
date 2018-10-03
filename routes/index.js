const blink = require('./blink');
const motor = require('./motor');

module.exports = (server) => {
  blink(server);
  motor(server);
};
