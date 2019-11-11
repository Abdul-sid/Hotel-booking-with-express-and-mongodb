const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
//const sgMail = require('@sendgrid/mail');
const { WebhookClient } = require("dialogflow-fulfillment");
const expressApp = express().use(bodyParser.json());

process.env.DEBUG = "dialogflow:debug";
// process.env.SENDGRID_API_KEY = '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';

const dburi =
  "mongodb+srv://abdurrehman:123456abdas@cluster0-mfsvo.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
  console.log("error occured", err);
});

// connection

mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
  console.log("error occured", err);
});

mongoose.connection.on('error', function (err) {//any error
  console.log('Mongoose connection error: ', err);
  process.exit(1);
})
mongoose.connection.on("connected", () => {
  console.log("Connected with database");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected with database.");
  process.exit(1);
});

// connection(end)
var userDetail = new mongoose.Schema({
    givenname: { type: String, required: true },
    email: { type: String, required: true }
  },
  {collection: "testing-dialogflow"},
  );
var model = new mongoose.model("userInfo", userDetail);

expressApp.post("/webhook", function (request, response, next) {
  const _agent = new WebhookClient({  request, response  });

  function welcome(agent) {
    agent.add(`Good day! you want to book a room`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function roomBooking(agent) {
    const name = agent.parameters.givenname;
    const email = agent.parameters.email;
    
    var saveData = new model({
      givenname: name,
      email: email
    });

   saveData.save((err, mydata) => {
     
    if (!err) {
        console.log("mydata: ", mydata);
      } else {
        console.log(err);
        agent.add(`Error while writing on database`);
      
      }
    });

     agent.add(`Thanks! ${name} your request is forwarded we will contact you on ${email}`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("RoomBooking", roomBooking);

  _agent.handleRequest(intentMap);
});
expressApp.listen(process.env.PORT || 3000, function () {
  console.log("app is running in 3000");
});




























// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// // const nodemailer = require("nodemailer");
// //const sgMail = require('@sendgrid/mail');
// const { WebhookClient } = require("dialogflow-fulfillment");
// const expressApp = express().use(bodyParser.json());

// process.env.DEBUG = "dialogflow:debug";
// // process.env.SENDGRID_API_KEY = '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';

// const dburi =
//   "mongodb+srv://abdurrehman:123456abdas@cluster0-mfsvo.mongodb.net/test?retryWrites=true&w=majority";
// mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
//   console.log("error occured", err);
// });

// // connection

// mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
//   console.log("error occured", err);
// });

// mongoose.connection.on('error', function (err) {//any error
//   console.log('Mongoose connection error: ', err);
//   process.exit(1);
// })
// mongoose.connection.on("connected", () => {
//   console.log("Connected with database");
// });

// mongoose.connection.on("disconnected", () => {
//   console.log("Disconnected with database.");
//   process.exit(1);
// });

// // connection(end)
// var userDetail = new mongoose.Schema({
//     givenname: { type: String, required: true },
//     email: { type: String, required: true }
//   },
//   {collection: "testing-dialogflow"},
//   );
// var model = new mongoose.model("userInfo", userDetail);

// expressApp.post("/webhook", function (request, response, next) {
//   const _agent = new WebhookClient({  request, response  });

//   function welcome(agent) {
//     agent.add(`Good day! you want to book a room`);
//   }

//   function fallback(agent) {
//     agent.add(`I didn't understand`);
//     agent.add(`I'm sorry, can you try again?`);
//   }

//   function roomBooking(agent) {
//     const name = agent.parameters.givenname;
//     const email = agent.parameters.email;
    
//     var saveData = new model({
//       givenname: name,
//       email: email
//     });
//    saveData.save((err, mydata) => {
     
//     if (!err) {
//         console.log("mydata: ", mydata);
//         agent.add(`Thanks! ${name} your request forwarded we will contact you on ${email}`);
//         return;

//       } else {
//         console.log(err);
//         agent.add(`Error while writing on database`);
//         return;
      
//       }
//     });

//     // agent.add(`Thanks! ${name} your request for ${persons} 
//     // persons have forwarded we will contact you on ${email}`);
//   }

//   let intentMap = new Map();
//   intentMap.set("Default Welcome Intent", welcome);
//   intentMap.set("Default Fallback Intent", fallback);
//   intentMap.set("RoomBooking", roomBooking);

//   _agent.handleRequest(intentMap);
// });
// expressApp.listen(process.env.PORT || 3000, function () {
//   console.log("app is running in 3000");
// });