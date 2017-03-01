import Ticket from '../model/ticket.js';
// config/database.js
module.exports = {

    'url' : 'mongodb://localhost:27017/radsystem', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
   
   //=====================================
   //==============Query==================
   //=====================================
   getTicketsList: (quantity, from, done) => {
                
      Ticket.find().sort({'status': 1}).limit(quantity).exec((err, data) => {
         done(err, data);
      });
      
   },

   getLatestTickets: (from, done) => {
      
   },
   
   getTicketDetailWithTicketNo: (ticketNo, done) => {
      Ticket.findOne({'ticketNumber':ticketNo}, (err, ticket) => {
         done(ticket);
      })
   },
   
   //=====================================
   //==============Submit==================
   //=====================================
   createNewTicketWithIDAndPw: (tvID, tvPW, others, done) => {
      
      let newTicket = new Ticket({
         
         id: tvID,
         password: tvPW,
         lastModifiedTime:new Date,
         handler: "",
         status: 0,
         ctlName: others ? others.ctlName : "",
         description: others ? others.description : "",
         creator: others ? others.creator : ""
         
      });
      
      Ticket.count({}, (err, count) => {
         if (err) {
            //habdler
         }
         
         newTicket.ticketNumber = count + 1;
         
         newTicket.save((err, ticket) => {
            if (err)
               console.warn("Error occured when creating a ticket", err);
            
            done(newTicket);
         });
         
      });

   },
   
   takeOverTicket: (ticketNo, handler, done) => {
      Ticket.updateOne(
         {"ticketnumber": ticketNo},
         {"status": 1,
          "handler": handler
         },
         (err, writeOpResult) => {
            done(err, writeOpResult);
         }
      );
   },
   
   finishTicket: (ticketNo, done) => {
      Ticket.updateOne(
         {"ticketnumber": ticketNo},
         {"status": 3},
         (err, writeOpResult) => {
            done(err, writeOpResult);
         }
      );
   },
   
   cancelTicket: (ticketNo, done) => {
      Ticket.updateOne(
         {"ticketnumber": ticketNo},
         {"status": 4},
         (err, writeOpResult) => {
            done(err, writeOpResult);
         }
      );
   }
}

// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from consultant
//        ===> 3 ==> Done
//        ===> 4 ==> Cancelled




// Ticket status ===> 
//        ===> 0 ==> No one on it
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Ticket has been done
//        ===> 3 ==> I am on it
//        ===> 4 ==> TBD


//Database API list
//
///////////////////////Necessary part/////////////////////
//
//////////////////////////
////// Get next x tickets (quatity, from) ///////
//          1. quatity ==> number of the returned list
//          2. (Optional) from ==> Returned list should start form the next ticket to this moment. If this para is not defined, return the latest x tickets.
//          
//          Sorted by ticket update time
//          return tickets list of an Array
//
//
//
////// Get new tickets (from) ///////
//          1. from ==> the time of the lastest ticket, returned list should be newer than this one
//          
//          Sorted by ticket update time
//          return tickets list of an Array
//
//
////////////////////////////
//
////// Get s ticket info (ticketNo) ///////
//          1. ticketNo ==> tiacket number
//          
//          Return all information of the ticket required as an Object
//
//
//
//
////// Take over a ticket (ticketNo, user) ///////
//          1. ticketNo ==> tiacket number
//          2. user ==> user name
//          
//          Change ticket status to 1, handler to the user
//          return success or not
//
//
//
////// Finish a ticket (ticketNo, user) ///////
//          1. ticketNo ==> tiacket number
//          2. user ==> user name
//          
//          Change ticket status to 2, handler to the user
//          return success or not
//
//
//
////// Finish a ticket (ticketNo, user) ///////
//          1. ticketNo ==> tiacket number
//          2. user ==> user name
//          
//          Change ticket status to 2, handler to the user
//          return success or not
//
//
//
///////////////////////Advance part/////////////////////
//
//
////// Switch over handler (ticketNo, toUser, fromUser) ///////
//          1. ticketNo ==> tiacket number
//          2. toUser ==> the user name to be tranfered to
//          3. (Optional) fromUser ==> original user name
//          
//          kepp ticket status to 2, handler to the user
//          return success or not
//
//
//














