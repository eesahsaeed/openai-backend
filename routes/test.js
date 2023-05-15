
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const config = require('../config.js');
const uuidv4 = require('uuid').v4;
const nodemailer = require("nodemailer");
const { SESClient, GetTemplateCommand } = require("@aws-sdk/client-ses");
const opn = require("opn")
const {google} = require("googleapis");
const {OAuth2Client} = require("google-auth-library");
const axios = require("axios");

const getUsers = function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "users-table"
  };

  docClient.scan(params, async function (err, data) {
    if (err) {
      console.log(err)
      res.send({
        success: false,
        message: err
      });
    } else {
      const { Items } = data;

      for (let i = 0; i < Items.length; i++){

        const transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            clientId: "655384205441-hmo3rskd2ghej55mmsuvk57v379l8hev.apps.googleusercontent.com",
            clientSecret: "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"
          }
        });

        transport.on('token', token => {
          console.log('A new access token was generated');
          console.log('User: %s', token.user);
          console.log('Access Token: %s', token.accessToken);
          console.log('Expires: %s', new Date(token.expires));
        });
      
        //await transport.verify();
        transport.sendMail({
          from: `"${Items[i].name}" <${Items[i].email}>`, // sender address
          to: ["Isah 308 <isahsaidu308@gmail.com>"], // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
          auth: {
            user: Items[i].email,
            refreshToken: Items[i].refresh_token,
            accessToken: Items[i].access_token,
            expires: Items[i].expiry_date
          }
        }).then(rs => {
          console.log(rs);
        })
        .catch(err => {
          console.log(err.message);
        })
      }


      /*res.json({
        success: true,
        users: Items
      });*/
    }
  });
}

router.post("/", async function(req, res){

  getUsers(req, res);

  /*
  const SCOPES = ['https://www.googleapis.com/auth/gmail.send', "https://mail.google.com"];
  const CLIENT_ID = "936257283713-neo0l1vae424n3fdq0t4djeucbmaiaqg.apps.googleusercontent.com";
  const clientSecret = "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";
  const redirectURL = "http://localhost:3000/login";

  const oauth2Client = new OAuth2Client(CLIENT_ID, clientSecret, redirectURL);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  })

  //console.log(authUrl)
 


  oauth2Client.getToken("4/0AbUR2VPYtWYy6955NkTlMe9zIwvWDioqubc7RV-T7UqVPhlZwedOAX2h_SU7e5X2dCbgyA", (err, token) => {
    if (err){
      console.log('Error while trying to retrieve access token', err);
    
      return;
    }

    console.log('access token', token);
    oauth2Client.credentials = token;

    console.log("oauth client", oauth2Client);

    
  })

  //oauth2Client.setCredentials({refresh_token: "1//03-PMhsDbwJ1mCgYIARAAGAMSNwF-L9Irl3apDVKUWQG08y-OP7J26lDwJlL0Nv354bX_sVSv0RD3bKiFvjfhMNaPBO454f6oghU"})

  const auth = {
    type: "OAuth2",
    user: "eesahsaeed@gmail.com",
    clientId: "936257283713-neo0l1vae424n3fdq0t4djeucbmaiaqg.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//03N9uvVhmTRF-CgYIARAAGAMSNwF-L9IrYiNXpD57bYAjWBkFtDTGw5nI0GJH-sppc5q87JdhVd3f4N-pWBKnd3po5PYkcquvaFM",
  };
 
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      ...auth,
      accessToken: "ya29.a0AWY7CklBrsCybJQGyRxXoFlsMW1qV32CFP1xrd-l-fnJEjjL1hMEIRiazpKBGysffbkpA9ptflDkF9QVonlLFfHbU0XA5xB4fMf3uHwZ7jHtwWuDC0Op9l6nRL_fc9mTms4H_gWjWbv_mzgZ5Sw8wzkHA6cSaCgYKAXgSARASFQG1tDrpNV0NzSeRYSjE3VzSFtt0Wg0163", 
    },
  });

  //await transport.verify();
  transport.sendMail({
    from: '"eesah saeed" <eesahsaeed@gmail.com>', // sender address
    to: ["Isah 308 <isahsaidu308@gmail.com>"], // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  }).then(rs => {
    console.log(rs);
  })
  .catch(err => {
    console.log(err.message);
  })*/
})

module.exports = router;





/*
const kebabCase = string => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

*/












 /*const auth = {
    type: "OAuth2",
    user: "eesahsaeed@gmail.com",
    clientId: "936257283713-neo0l1vae424n3fdq0t4djeucbmaiaqg.apps.googleusercontent.com",
    clientSecret: "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",
    //refreshToken: "1//045UrLji_qdZMCgYIARAAGAQSNwF-L9IrUOz_RU3F7uh52fHLO_vl4XoVgqC3eHxq2yBjjpOUH2P32VvALZxfGtyOR5fV1pga6wM",
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      ...auth,
      accessToken: "ya29.a0AWY7CklJnJEeb7lH9ubPPbaZCHn82Zda3osLmJ-7B36OAin_m0qKN8vjtwMUbGXUf4x4dPnxqf5smxFmFztGvKxHIryJai_aww2jYQJbmO1PRkxc6pt9ERvLbGiLAU4Pzc7D6QZUFxgnSxBt10Z7Os6Oh1xqzgaCgYKAXYSARASFQG1tDrp3Msulxjn0mzhM9kBcgqeMw0165", 
    },
  });

  await transport.verify();
  transport.sendMail({
    from: '"Fred Foo 👻" <eesahsaeed@gmail.com>', // sender address
    to: ["Isah good <isahsaidu418@gmail.com>"], // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  }).then(rs => {
    console.log(rs);
  })*/
