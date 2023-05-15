
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const config = require('../config.js');
const uuidv4 = require('uuid').v4;
const nodemailer = require("nodemailer");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const csv = require('csvtojson');

const {getInitialEmail, getFollowUp1Email, getFollowUp2Email, getFollowUp3Email} = require("./emails-templates.js");

const newCampaign = function (req, res) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  let campaignId = uuidv4();

  let newBody = {...req.body, completed: 1, status: "In Progress", id: campaignId};
  let Item = newBody;
  
  var params = {
    TableName: config.aws_table_name,
    Item: Item
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      res.json({err})
    } else {
      res.json(newBody);
    }
  });
}

const getCampaigns = function (req, res) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: config.aws_table_name
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: err
      });
    } else {
      const { Items } = data;
      res.send({
        success: true,
        movies: Items
      });
    }
  });
}

const updateUsers = function(req, res){
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const params = {
    TableName: config.aws_table_name,
    Key: {
      id: req.body.id
    },
    UpdateExpression: "set #campaignUsers = :u, #completed = :c",
    ExpressionAttributeNames: {
      "#campaignUsers": "campaignUsers",
      "#completed": "completed"
    },
    ExpressionAttributeValues: {
      ":u": req.body.campaignUsers,
      ":c": req.body.completed
    }
  };

  docClient.update(params, function(err, data) {
    if (err) {
      console.log(err)
      res.json(err)
    }
    else res.json(data);
  });
}

const updateEmails = function(req, res){
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  
  const params = {
    TableName: config.aws_table_name,
    Key: {
      id: req.body.id
    },
    UpdateExpression: "set #initialMessage = :i, #followUp1Message = :f1, #followUp2Message = :f2, #followUp3Message = :f3",
    ExpressionAttributeNames: {
      "#initialMessage": "initialMessage",
      "#followUp1Message": "followUp1Message",
      "#followUp2Message": "followUp2Message",
      "#followUp3Message": "followUp3Message"
    },
    ExpressionAttributeValues: {
      ":i": req.body.initialMessage,
      ":f1": req.body.followUp1Message,
      ":f2": req.body.followUp2Message,
      ":f3": req.body.followUp3Message
    }
  };

  docClient.update(params, function(err, data) {
    if (err) {
      console.log(err)
      res.json(err)
    }
    else res.json(data);
  });
}

/* GET users listing. */
router.post('/new-campaign', function(req, res, next) {
  newCampaign(req, res)
});

router.post("/update-users", function(req, res){
  console.log(req.body);
  updateUsers(req, res);
});

router.post('/process-csv', upload.single("users"), function(req, res, next) {
  console.log(req.file)
  //res.json({good: "yes"})
  csv()
  .fromFile(req.file.path)
  .then((jsonObj) => {
    res.json(jsonObj);
  })
  .catch(err => {
    console.log(err);
  })
});

router.post("/send-emails", function(req, res){
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });

  let users = req.body.campaignUsers;
  let senderEmail = req.body.senderEmail;

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "email = :e",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ":e": senderEmail
    },
    TableName: "users-table",
  };
  
  
  // Call DynamoDB to read the item from the table
  docClient.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      res.json(err);
    } else {
      let sender = data.Items[0];
      console.log(users);

      for (let i = 0; i < users.length; i++){
        const transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET
          }
        });

        /*transport.on('token', token => {
          console.log('A new access token was generated');
          console.log('User: %s', token.user);
          console.log('Access Token: %s', token.accessToken);
          console.log('Expires: %s', new Date(token.expires));
        });*/
      
        //await transport.verify();
        transport.sendMail({
          from: `"${sender.name}" <${sender.email}>`, // sender address
          to: [`${users[i]["First Name"]} ${users[i]["Last Name"]} <${users[i].Email}>`], // list of receivers
          subject: `Greetings ${users[i]["First Name"]}`, // Subject line
          text: "Hello world?", // plain text body
          html: getInitialEmail(users[i]["First Name"], users[i]["Company Name"]), // html body
          auth: {
            user: sender.email,
            refreshToken: sender.refresh_token,
            accessToken: sender.access_token,
            expires: sender.expiry_date
          }
        }).then(rs => {
          console.log(rs);
        })
        .catch(err => {
          console.log(err.message);
        })
      }

      res.json(data)
    }
  });
});

module.exports = router;


// , createdAt: new Date().toString()

