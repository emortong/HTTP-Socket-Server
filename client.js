const net = require('net');
const PORT = 8080;
const EVENT_DATA = 'data';
let url;
let body = '';
let uri = '';
let date = new Date();
date.toUTCString();
let host;

process.argv.forEach((val, index) => {
  if(index === 2) {
    url = val;

    if(val.includes('http://')) {
      val = val.substring(7);
    } else if(val.includes('https://')) {
      val = val.substring(8);
      console.log(val)
    }

    let path = val.split('/');
    host = path.splice(0,1);
    host = host.toString();
    console.log(host);
    if(path.length === 0) {
      uri = '/'
    } else {
      path.forEach((x) => {
        uri += `/${x}`
      })
    }
  }
})


let header = `GET ${uri} HTTP/1.1\r\nDate: ${date}\r\nHost: ${host}\r\nUser-Agent: estefania/curl\r\nConnection: close\r\n\r\n`
console.log(header);
if(url === 'localhost') {
  let client = net.connect(PORT, url, () => {
      client.write(header);
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

