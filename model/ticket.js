import mongoose from 'mongoose';

let ticketSchema = mongoose.Schema({
   
   ticketNumber: String,
   id: String,
   password:String,
   lastModifiedTime: Date,
   handler: String,
   status: Number,
   ctlName: String,
   description: String,
   creator: String
   
});


// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waitingh for feedback from cnosultant
//        ===> 3 ==> Done

module.exports = mongoose.model('Ticket', ticketSchema);