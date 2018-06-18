var mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    Promise = require('bluebird'),
    redis = require("redis");
var wss = require('ws');
var events = require('events');
var eventEmitter = new events.EventEmitter();
    publisher = require('redis').createClient();

/** Import the Message Model **/
require('../model/message');

const Message = mongoose.model('Message');

var channel= 'postMessage';

function createMessagePost( req, res, next ) {

    return Message
        .find({}).then(post => res.render( "messageView/postMessage", {
           meta : {
               description : post && post.type
           },
           noAlternate : true,
           post
       })).catch(next);
}

function submitMessage( req, res, next ) {

      return new Message( {
          from : req.body.fromId,
          to :  req.body.toId,
          subject : req.body.subject,
          body : req.body.body,
          createdAt : Date.now(),
          readAt : Date.now(),
      })
      .save()
      .then(messageData => {
          publisher.publish(channel, messageData.to);
          wss.emit('home');
          res.render('messageView/sent');
      })
      .catch((err) => { console.log(err); next(); })
}


function publisher(data)
{
     client.publish(channel, data.subject);

}

module.exports.eventEmitter=eventEmitter;
module.exports = { createMessagePost ,submitMessage};
