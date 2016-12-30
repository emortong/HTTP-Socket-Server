const net = require('net');
const PORT = 8080;
const EVENT_DATA = 'data';
let host;
let url;
let date = new Date();
date.toUTCString();
let body = '';
let uri;

process.argv.forEach((val, index) => {
  if(index === 2) {
    console.log(`${index}: ${val}`);
    url = val;
    let path = val.split('/');
    host = path[0];
    if(path[1] === undefined) {
      uri = '/'
    } else {
      uri = `/${path[1]}`;
    }
  }
})

console.log(uri);
let header = `GET ${uri} HTTP/1.1\r\nDate: ${date}\r\nHost: ${host}\r\nUser-Agent: estefania/curl\r\nConnection: close\r\n\r\n`

if(host === 'localhost') {
  let client = net.connect(PORT, host, () => {
      client.write(header);
  })
} else {

  let client = net.createConnection(80, url, () => {
    client.write(header);
  })

    client.on('data', (data) => {
      body += data;
    })

    client.on('end', () => {
      process.stdout.write(body);
    })
}

