const net = require('net');
const PORT = 8080;
const EVENT_DATA = 'data';
let url;
let body = '';
let uri = '';
let date = new Date();
date.toUTCString();
let host;
let method;

process.argv.forEach((val, index) => {
  let i;
  if(process.argv.length === 3) {
    i = 2;
    method = 'GET';
  } else if(process.argv.indexOf('-I') !== -1) {
    i = 3;
    method = 'HEAD';
  }

  if(index === i) {
      url = val;
      if(val.includes('http://')) {
        val = val.substring(7);
      } else if(val.includes('https://')) {
        val = val.substring(8);
      }

      let path = val.split('/');
      host = path.splice(0,1);
      host = host.toString();
      if(path.length === 0) {
        uri = '/'
      } else {
        path.forEach((x) => {
          uri += `/${x}`
        })
      }
    }

})
console.log('host:', host);
console.log('url: ', url);
console.log('uri: ', uri);
console.log('method: ', method);

let header = `${method} ${uri} HTTP/1.1\r\nDate: ${date}\r\nHost: ${host}\r\nUser-Agent: estefania/curl\r\nConnection: close\r\n\r\n`;
console.log(header);
if(host === 'localhost') {
  let client = net.connect(PORT, host, () => {
      client.write(header);
  })

    client.on('data', (data) => {
      body += data;
    })

    client.on('end', () => {
      process.stdout.write(body);
    })

} else {
  let client = net.createConnection(80, host, () => {
    client.write(header);
  })

    client.on('data', (data) => {
      body += data;
    })

    client.on('end', () => {
      process.stdout.write(body);
    })
}
