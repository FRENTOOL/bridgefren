const auth = require('./authority.js');
const http = require('http');
const port = 4000;

const requestHandler = (request, response) => {
  const url = new URL('http://' + request.host + request.url);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

  // if process request to authorize swap
  switch (url.pathname) {
    case '/auth':
      const params = url.searchParams;
      const txId = params.get('tx'); // transaction ID
      const fromChainId = params.get('chain'); // transaction chain ID
      auth
        .authorize(txId, fromChainId)
        .then(resp => {
          response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify(resp));
        })
        .catch(err => {
          response.writeHead(404, { 'Content-Type': 'text/html' });
          response.end(err.toString());
        });
      break;
    case '/ping':
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ isSuccess: true, message: 'pong' }));
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end(request.url.toString() + ' file not found');
      break;
  }
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
