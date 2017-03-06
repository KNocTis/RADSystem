import mongoose from 'mongoose';

let ticketSchema = mongoose.Schema({
   
   ticketNumber: Number,
   id: String,
   password:String,
   lastModifiedTime: Date,
   handler: String,
   status: Number,
   ctlName: String,
   description: String,
   creator: String,
   ctlLocation: String,
   issue: String,
   email: String
   
});


// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from consultant
//        ===> 3 ==> Done
// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from consultant
//        ===> 3 ==> <---------- Reserved : formerly DONE---------->
//        ===> 4 ==> Cancelled
//        ===> 5 ==> Terminated by IT
//        ===> 6 ==> Unexpectedly closed
//        ===> 7 ==> Pass
//        ===> 8 ==> Fail

module.exports = mongoose.model('Ticket', ticketSchema);