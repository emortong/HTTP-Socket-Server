const net = require('net');
const PORT = 8080;
const EVENT_DATA = 'data';

let client = net.connect(PORT, 'localhost', () => {

  process.stdin.on(EVENT_DATA, function(data) {
    client.write(data);
  })

  client.on(EVENT_DATA, function(data) {
      process.stdout.write(data);
    })

})