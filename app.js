var express = require('express'),
    path = require('path'),
    mongoose= require('mongoose'),
    Promise = require('bluebird'),
    subscriber = require( "redis" ).createClient(),
    bodyParser = require('body-parser'),
    app = express();
var name;

//Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)

//Redis Channel
var channel= 'postMessage';

/** Importing Controllers **/
var message = require('./controller/message');
var client = require('./controller/client');


/** Import the Message Model **/
require('./model/message');
const Message = mongoose.model('Message');


// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hbs' );

/** Importing Models **/
app.use(bodyParser.urlencoded({
    extended: true
}));

//middlewares
app.use(express.static('public'))
app.use(bodyParser.json());
//var port = process.env.PORT || 8000;

var id;

const connectedUsers = [];

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/MessageService',function(err,db) {

    if ( err ) {
        throw err;
    }
    console.log( "Connected to MongoDB" );
    //listen on every connection
    //listen on every connection
    io.on( 'connection', ( socket ) => {
       id=0;
       //listen on messages from the client
        socket.on( 'new_message', ( data ) => {
            console.log("Client with name",data.message ," is now connected");
            var name=data.message;
            var client = new Client(name);
        } )

        //Function to emit message
        sendMessageToClientFromserver = (function (socket) {
            return function (data) {

                for(var x in connectedUsers)
                {
                   if(connectedUsers[x]==data.to)
                   {
                       console.log("Matched");
                       socket.emit("new_message",data.body);
                   }
                  //
                }


                }
            })(socket);

       // sendMessageToClientFromserver.bind(socket);
   } )

})

    app.get('/showMessage/:name',(req, res,next)=>
    {
        var name=req.params.name;
        res.render( "messageView/client",
            {
                name
            });

    });

    app.get( '/postMessage', (req,res,next)=>
    {
        return Message
            .find({}).then(post => res.render( "messageView/postMessage", {
                meta : {
                    description : post && post.type
                },
                noAlternate : true,
                post
            })).catch(next);

    });

    app.post( '/submitMessage', (req,res,next)=>
    {
        var publisher = require('redis').createClient();
        return new Message( {
            from : req.body.fromId,
            to :  req.body.toId,
            subject : req.body.subject,
            body : req.body.body,
            createdAt : Date.now(),
            readAt : Date.now(),
        })  .save()
            .then(messageData => {
                publisher.publish(channel, messageData.to);
                var client_name=messageData.to;
                //sendMessageToClient(client_name);
               sendMessageToClientFromserver(messageData);
                res.render('messageView/sent');
            })

            .catch((err) => { console.log(err); next(); })
    });

subscribe();
function subscribe()
{
    return new Promise( function(resolve, reject) {
        subscriber.on( "message", function( channel, message ) {

            console.log( "Message sent to User : " + message );
        } );
        subscriber.subscribe( channel, ( error, count ) => {
            if ( error ) {
                console.log("R");
                reject(error)
            }else
            {   x="SUCCESS";
                resolve(x)
                //console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
            }


        } );
    })

}

function Client(name) {
    this.name=name;
    connectedUsers.push(name);
    console.log(connectedUsers);
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

function publisher(data)
{
    client.publish(channel, data.subject);

}

/** catch 404 and forward to error handler **/
app.use( function( req, res, next ) {
    console.log('Got in 404');
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
} );


/** error handler **/
    app.use( function( err, req, res, next ) {
        console.log('Error handler');
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};
        // render the error page
        res.status( err.status || 500 );
        res.render( 'error' );
    } );

module.exports=app;



