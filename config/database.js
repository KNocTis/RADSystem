import Ticket from '../model/ticket.js';
import moment from 'moment';
// config/database.js
module.exports = {

    'url' : 'mongodb://localhost:27017/radsystem', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
   
   //=====================================
   //==============Query==================
   //=====================================
   getTicketsList: (quantity, from, done) => {
                
      Ticket.find().sort({'status': 1, 'ticketNumber': -1}).limit(quantity).exec((err, data) => {
         done(err, data);
      });
      

      
   },

   getTicketsFrom: (from, quantity, done) => {
      
      Ticket.find().sort({'ticketNumber': -1}).where('ticketNumber').lt(from).limit(quantity).exec((err, data) => {
         done(err, data);
      });
      
   },
   
   getTicketDetailWithTicketNo: (ticketNo, done) => {
      Ticket.findOne({'ticketNumber':ticketNo}, (err, ticket) => {
         done(ticket);
      })
   },
   
   getWaitingTickets: (done) => {
      Ticket.find({"status": 0}).select('ticketNumber').exec((err, data) => {
         done(err, data);
      });
   },
   
   searchTickets: (content, done) => {
      let re = new RegExp(content, 'i');

      Ticket.find().or([{ 'ctlName': { $regex: re }}, { 'email': { $regex: re }}]).sort({'status': 1, 'ticketNumber': -1}).exec((err, tickets) => {
          done(err, tickets);
      });
   },
   
   //=====================================
   //==============Submit==================
   //=====================================
   createNewTicketWithIDAndPw: (tvID, tvPW, others, done) => {
      
      //async
      process.nextTick(() => {
         //Check if there is a ticekt with same ID
         Ticket.find({"id": tvID}).sort({lastModifiedTime: -1}).exec(
            (err, ticket) => {
               if(err){
                  console.log("Error occured when finding a ticket", err);
                  return false;
               }
              
               ///======================================
               //If the ticket is created within 45 minutes
               if(ticket.length > 0){
                 let theTicket = ticket[0];
                  if (moment().subtract(45, "minutes").isBefore(theTicket.lastModifiedTime)){
                     console.log("This ID has been created within 45 minutes", theTicket.id, ", status: ", theTicket.status);
                    
                    //Jump to next part, create a new ticket if this one is done
                     if (theTicket.status == 7 || theTicket.status == 8) {} 
                    //Do thing but get out of Database and return this ticket
                    // 1 or 2 =====> Doing the test
                    // 0 =============> Is waiting to be taken(Jumping queue is not allowed)
                      else if (theTicket.status == 1 || theTicket.status == 2 || theTicket.status == 0) {
                        done(err, theTicket);
                        return false;
                      } 
                    //Update the ticket if its cancelled or terminated
                    else {
                        //Pull the ticket to the top of query, then return
                        theTicket.status = 0;
                        theTicket.password = tvPW;
                        theTicket.save((err, updatedTicket) => {
                           done(err, updatedTicket);
                        });
                        return true
                     }
                  }
               }

               ///=================================
               //If there is no ticket with same ID
               let otherInfo;
               if (others) {
                  otherInfo = others;
               } else {
                  otherInfo = {};
               }
               //Create a new one
               let newTicket = new Ticket({

                  id: tvID,
                  password: tvPW,
                  lastModifiedTime:new Date,
                  handler: "",
                  status: 0,
                  ctlName: otherInfo.ctlName ? otherInfo.ctlName : "",
                  description: otherInfo.description ? otherInfo.description : "",
                  creator: otherInfo.creator ? otherInfo.creator : "",
                  email: otherInfo.email ? otherInfo.email : "",
                  issue: otherInfo.issue ? otherInfo.issue : ""

               });

               //Get the number of tickets in database
               //and set the ticket number
               Ticket.count({}, (err, count) => {
                  if (err) {
                     //habdler
                     console.warn("Error occured when count a tickets");
                     return false;
                  }

                  newTicket.ticketNumber = count + 1;

                  newTicket.save((err, ticket) => {
                     if (err)
                        console.warn("Error occured when creating a ticket", err);

                     done(err, newTicket);
                  });

               });

            }
         );
      });
   },
   
   takeOverTicket: (ticketNo, handler, done) => {
      
//      console.log("takeOverTicket is called and 2 props: ", ticketNo, handler);
      //async
      process.nextTick(() => {
         //
         Ticket.findOne(
            {"ticketNumber": ticketNo},
            (err, theTicket) => {
               if(err) {
                  console.log("Error occured when finding a ticket", err);
                  return false;
               }
               ///=================================
               //If the ticket NOT found
               if (!theTicket) {
                  done("Ticket " + ticketNo + " not found");
               }
               
//               console.log("takeOverTicket ", theTicket);
               ///=================================
               //If the ticket has NOT been taken over yet
               if (theTicket.status == 0 || theTicket.status == 2) {
                  theTicket.status = 1;
                  theTicket.handler = handler;
                  
                  theTicket.save((err, updatedTicket) => {
                     if(err) {
                        console.warn("Error occured when saving a ticket", err);
                        return false;
                     }
                     
                     console.log("Ticket ", updatedTicket.ticketNumber, "taken over by ", updatedTicket.handler);
                     done(null, updatedTicket);
                     return true;
                  })
               }
               
               ///=================================
               //If the ticket has AlLREADY been taken over or done
               done("Ticket ", ticketNo, "might have been taken over by someone or it's already done");
               
            }
         );
      });

   },
   
   finishTicket: (ticketNo, status, handler, done) => {
      
      //async
      process.nextTick(() => {
         //
         Ticket.findOne(
            {"ticketNumber": ticketNo},
            (err, ticket) => {
               if(err) {
                  console.log("Error occured when finding a ticket", err);
                  return false;
               }
               
               ///=================================
               //If the ticket NOT found
               if (!ticket) {
                  done("Ticket ", ticketNo, " not found");
               }
               
               ///=================================
               //The can be done only when someone is on it
               if (ticket.status == 1) {
                  if (ticket.handler !== handler){
                     console.warn("Ticket can't be done by handler other than ", ticket.handler);
                     done("Ticket can't be done by another handler");
                  }
                  
                  ticket.status = status;
                  
                  ticket.save((err, updatedTicket) => {
                     if(err) {
                        console.warn("Error occured when saving a ticket", err);
                        return false;
                     }
                     
                     console.log("Ticket ", updatedTicket.ticketNumber, "is done");
                     done(null, updatedTicket);
                     return true;
                  })
               }
               
               ///=================================
               //If the ticket has AlLREADY been taken over or done
               done("Ticket ", ticketNo, "cannot be finished, because no one is on it");
               
            }
         );
      }); 
      
   },
   
   
   // type ===> 0 or undefined ==> normally cancel
   //           1 ===============> expectedly cancel
   //           2 ===============> cancelled by IT
   cancelTicket: (ticketNo, type, done) => {
 
      //async
      process.nextTick(() => {
         //Find the ticket first
         Ticket.findOne(
            {"ticketNumber": ticketNo},
            (err, ticket) => {
               if(err) {
                  console.log("Error occured when finding a ticket", err);
                  return false;
               }

               //Ticket can be cancelled ONLY when ticket status == 1 2 3
               if (ticket.status == 0 || ticket.status == 1 || ticket.status == 2) {
                  //Determine cancellation type
                  let status = 4;
                  if (type == 1){
                        status = 6;
                  } else if (type == 2) {
                        status = 5;
                  }
                  
                  ticket.status = status;
                  
                  ticket.save((err, updatedTicket) => {
                     done(err, updatedTicket);
                     return true;
                  })
               } else {
                  console.log("Ticket ", ticket.ticketNumber, "can't be cancelled, since it's already cancelled or done")
               }

            }
         );
      });

   },
   
   updateTicket: (ticket, done) => {
      
      //async
      process.nextTick(() => {
         //Find the ticket first
         Ticket.findOne(
            {"ticketNumber": ticket.ticketNumber},
            (err, oldTicket) => {
               if(err) {
                  console.log("Error occured when finding a ticket", err);
                  return false;
               }

               //Ticket can be updated ONLY when ticket status == 1 2 3
               if (oldTicket.status == 0 || oldTicket.status == 1 || oldTicket.status == 2) {
                  
                  if (ticket.id)
                     oldTicket.id = ticket.id;
                  if (ticket.passowrd)
                     oldTicket.password = ticket.passowrd;
                  
                  
                  oldTicket.save((err, updatedTicket) => {
                     done(err, updatedTicket);
                     return true;
                  })
               } else {
                  console.log("Ticket ", ticket.ticketNumber, "can't be updated, since it's already cancelled or done")
               }

            }
         );
      });
      
   }
}

// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waiting for feedback from consultant
//        ===> 3 ==> Done
//        ===> 4 ==> Cancelled




// Properties//
// 1. ticketStatus ===> 0 ==> Waiting
//        ===> 1 ==> Some one is on it
//        ===> 2 ==> Failed to connect, waitingh for feedback from cnosultant
//        ===> 3 ==> Done


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





