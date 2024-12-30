const mongoose=require("mongoose");
const JoinRequestSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    clubId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required:true
    },
    status:{
        type:String,
        enum:["pending","rejected","approved"],
        default:"pending"
    },
    requestedAt:{
        type:Date,
        default:Date.now
    }
    ,
    responededAt:{
        type:Date
    }

});

const JoinRequest=mongoose.model("JoinRequest",JoinRequestSchema);
module.exports=JoinRequest;