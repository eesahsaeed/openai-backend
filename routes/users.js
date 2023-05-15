
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const config = require('../config.js');
const uuidv4 = require('uuid').v4;
const {google} = require("googleapis");
const {OAuth2Client} = require("google-auth-library");
const axios = require('axios');

const addUser = function (user, req, res) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  const Item = {...user, sent: 0, limit: 500, id: uuidv4()};
  
  var params = {
    TableName: "users-table",
    Item: Item
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      res.send({
        success: false,
        message: err
      });
    } else {
      res.json(Item);
    }
  });
}

const getUsers = function (req, res) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "users-table"
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err)
      res.send({
        success: false,
        message: err
      });
    } else {
      const { Items } = data;
      res.json(Items);
    }
  });
}

router.get("/all-users", function(req, res){
  getUsers(req, res);
});

router.post("/get-auth-url", function(req, res){
  const SCOPES = [
    "https://mail.google.com",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ];
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectURL = req.body.origin;

  const oauth2Client = new OAuth2Client(CLIENT_ID, clientSecret, redirectURL);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  res.json({authUrl});
});

/* GET users listing. */
router.post("/add-user", function(req, res){
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectURL = req.body.origin;

  const oauth2Client = new OAuth2Client(CLIENT_ID, clientSecret, redirectURL);

  oauth2Client.getToken(req.body.code, (err, token) => {
    if (err){
      console.log('Error while trying to retrieve access token', err);
      res.json(err)
    
      return;
    }

    oauth2Client.credentials = token;

    axios
    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/json'
      }
    })
    .then((result) => {
      addUser({...token, ...result.data}, req, res);
    })
    .catch((err) => {
      console.log(err.message)
      res.json(err)
    });
  });
});

module.exports = router;

