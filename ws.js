/*

'use strict';
let WSServer = require('ws').Server;
const WebSocket = require('ws');
let server = require('http').createServer();
let app = require('./app');
var port = process.env.PORT || 8000;

const clientById = {};

// Create web socket server on top of a regular http server
let wss = new WSServer({
    server:server
});

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url.toString();
    console.log(pathname);

});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws ) {
    ws.send("You are now Connected");

    const id = 1;
    const client = new Client(id, ws);
    clientById[id] = client;

    ws.on('error',function(  ) {
        console.log("error");
    });

    ws.on('message', function(){

    });

    ws.on('close', function(){

    });

});

wss.on('error',function(  ) {
    console.log("error");
});

server.listen(port, function() {
    console.log(`server listening on ${port}`);
});

function Client(id, ws) {
    this.id = id;
    this.ws = ws;
}

Client.prototype.sendMessage = function( message, callback ) {
    this.ws.send( JSON.stringify( {
        subject: message.subject,
        body: message.body
    } ), err => {
        if( err ) {
            callback(err)
        } else {
            callback( undefined, true );
        }
    } );
};

function sendMessageToClient(message, callback) {
    const client = clientById[message.to];
    if(!client) {
        callback(undefined, false);
    } else {
        client.sendMessage( message, callback );
    }
}

exports.sendMessageToClient = sendMessageToClient;

*/
