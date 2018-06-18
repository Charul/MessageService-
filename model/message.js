/**
 *  Models / Message
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/** Dependencies */
const  mongoose        = require( "mongoose" ),
       uniqueValidator = require( "mongoose-unique-validator" ),
       Schema = mongoose.Schema;
/**
 * Model schema definition
 */
const MessageSchema = new Schema( {
    from :{ type : String, required : true },
    to : { type : String, required : true },
    body : { type : String, default : "", required : true },
    subject : { type : String, default : "", required : true },
    createdAt : { type : String, default : "", required : true },
    readAt : { type : String, default : "", required : true },
}    , {
    timestamps : true
} );

MessageSchema.index( {
    subject : "text",
    from : "text",
    to : "text"

} );

/** Install the slug plugin */
//PartnerSchema.plugin( slug, { virtual : { fields : ["company"] } } );

/** Install the lang plugin */
//PartnerSchema.plugin( lang );

/** Add unique validator */
MessageSchema.plugin( uniqueValidator );

mongoose.model( "Message", MessageSchema );

