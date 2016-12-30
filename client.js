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
let postMessage = '';

process.argv.forEach((val, index) => {
  let i;
  if(process.argv.length === 3) {
    i = 2;
    method = 'GET';
  } else if(process.argv.indexOf('-I') !== -1) {
    i = 3;
    method = 'HEAD';
  } else if(process.argv.indexOf('-P') !== -1) {
    i = 3;
    method = 'POST';
    if(index >= 4) {
      console.log(val);
      postMessage += `${val.toString()} `;
    }
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


let header = `${method} ${uri} HTTP/1.1\r\nDate: ${date}\r\nHost: ${host}\r\nUser-Agent: estefania/curl\r\nConnection: close\r\n\r\n`;

if(postMessage !== undefined) {
  header += `Post Message:\r\n${postMessage}`;
}

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

    client.on('error', (e) => {
      if(e.code == 'ENOTFOUND') {
        process.stdout.write('client cannot be reached\n');
      } else if(e.code == 'ECONNREFUSED') {
        process.stdout.write('Connection refused by server\n');
      } else if(e.code == 'ECONNRESET') {
        process.stdout.write('The connection closed\n')
      }
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

    client.on('error', (e) => {
      if(e.code == 'ENOTFOUND') {
        process.stdout.write('client cannot be reached\n');
      } else if(e.code == 'ECONNREFUSED') {
        process.stdout.write('Connection refused by server\n');
      } else if(e.code == 'ECONNRESET') {
        process.stdout.write('The connection closed\n')
      }
    })
}

