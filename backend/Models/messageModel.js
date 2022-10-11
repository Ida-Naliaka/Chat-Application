const mongoose= require ("mongoose");

const messageSchema= mongoose.Schema({
    content:{type:String, trim: true},
    attachment: {type: String},
    sentAt: {type: Date},
    sender:[
        {type: mongoose.Schema.Types.ObjectId,
    ref: "User",}
],
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    
}, {
    timestamps: true,
    toJSON: {virtuals: true}
});

const Message=mongoose.model("Message", messageSchema);

module.exports = Message;