var express = require('express'),
    app = express();
var  name;
function socketExample(req,res,next) {
    res.render( "messageView/client" );
    name =req.params.name;

}

module.exports.name = name;
//module.exports = {socketExample};