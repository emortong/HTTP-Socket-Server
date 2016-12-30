const net = require('net');
const PORT = 8080;
const EVENT_DATA = 'data';
const index = require('./index.js');
const hydrogen = require('./hydrogen.js');
const helium = require('./helium.js');
const notFound = require('./404.js');
const styles = require('./styles.js');
let host;
let responseHeaderStorage = [];
let postMessageStorage = [];

let files = {
  index: {
    body: index,
    content_type: 'text/html; charset=utf-8',
    content_length: index.length
  },
  hydrogen: {
    body: hydrogen,
    content_type: 'text/html; charset=utf-8',
    content_length: hydrogen.length
  },
  helium: {
    body: helium,
    content_type: 'text/html; charset=utf-8',
    content_length: helium.length
  },
  notFound: {
    body: notFound,
    content_type: 'text/html; charset=utf-8',
    content_length: notFound.length
  },
  styles: {
    body: styles,
    content_type: 'text/css; charset=utf-8',
    content_length: styles.length
  }
};

let server = net.createServer((socket) => {

  socket.on(EVENT_DATA, (data) => {
    data = data.toString().trim();
      console.log(data)
      storeResponseHeaders(data);

      let reqArr = data.split('\n');
      let postMess = reqArr[reqArr.length-1]
      let reqSpec = reqArr[0].split(' '); // request type, path and version
      let date = new Date();
      date.toUTCString();
      let server = 'estefania/0.0.1';
      let body;
      let header;
      let content_type;
      let content_length;

      switch(reqSpec[1]) {
        case '/':
        case '/index.html':
        header = `HTTP/1.1 200 OK\nDate: ${date}\nServer: ${server}\nContent-Type: ${files.index.content_type}\nContent-Length: ${files.index.content_length}\n\n`;
        body = files.index.body;
        break;

        case '/hydrogen.html':
        header = `HTTP/1.1 200 OK\nDate: ${date}\nServer: ${server}\nContent-Type: ${files.hydrogen.content_type}\nContent-Length: ${files.hydrogen.content_length}\n\n`;
        body = files.hydrogen.body;
        break;

        case '/helium.html':
        header = `HTTP/1.1 200 OK\nDate: ${date}\nServer: ${server}\nContent-Type: ${files.helium.content_type}\nContent-Length: ${files.helium.content_length}\n\n`;
        body = files.helium.body;
        break;

        case '/css/styles.css':
        header = `HTTP/1.1 200 OK\nDate: ${date}\nServer: ${server}\nContent-Type: ${files.styles.content_type}\nContent-Length: ${files.styles.content_length}\n\n`;
        body = files.styles.body;
        break;

        default:
        header = `HTTP/1.1 404 NOT FOUND\nDate: ${date}\nServer: ${server}\nContent-Type: ${files.notFound.content_type}\nContent-Length: ${files.notFound.content_length}\n\n`;
        body = files.notFound.body;
        break;
      }

      if(reqSpec[0] === 'HEAD') {
        socket.write(header);
        socket.end();
      } else if(reqSpec[0] === 'GET') {
        socket.write(header);
        socket.write(body);
        socket.end();
      } else if(reqSpec[0] === 'POST') {
        postStorage(postMess, date)
        socket.write(`succesfull post\n`)
        console.log(postMessageStorage);
        socket.end();
      }
  })

})




server.listen(PORT, () => {
  console.log('opened server on', server.address())
})


function storeResponseHeaders(data) {
  let responseHeader = {
    header: data
  }
  responseHeaderStorage.push(responseHeader);
}

function postStorage(message, date) {
  let post = {
    post: message,
    date: date
  }
  postMessageStorage.push(post);
}