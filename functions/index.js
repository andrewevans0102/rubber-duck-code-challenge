const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config()
const request = require('request');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const db = admin.firestore();

// when a new user is registered
exports.createUser = functions.firestore
    .document('user/{userId}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const firstName = newValue.firstName;
      const lastName = newValue.lastName;
      const slackWebhook = process.env.CREATE_USER;
      const message = "user " + firstName + " " + lastName + " just registered!";
      request.post(slackWebhook, { json: { text: message } });
      return res.status(200).send('slack message sent successfully');
    });

// when a new activity is created
exports.createActivity = functions.firestore
    .document('activity/{Id}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const firstName = newValue.firstName;
      const lastName = newValue.lastName;
      const activity = newValue.activity;
      const description = newValue.description;
      const link = newValue.link;
      const points = newValue.points;
      const slackWebhook = process.env.CREATE_ACTIVITY;
      const message = firstName + " " + lastName + " just added the activity " + activity
        + " for " + points + " points with the description \"" + description + ".\"  Here's a the link " + link + ".";
      request.post(slackWebhook, { json: { text: message } });
      return res.status(200).send('slack message sent successfully');
    });

// slack notification for high scores channel
app.post('/api/slack/high_score', (req, res) => {
      (async () => {
          const slackWebhook = process.env.HIGH_SCORES;
          const message = req.body.message;
          await request.post( slackWebhook, { json: { text: message } });
          return res.status(200).send('success');
        })();
  });

// Create user
app.post('/api/user', (req, res) => {
    (async () => {
        try {
            await db.collection('user').doc('/' + req.body.uid + '/').create(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
      })();
  });

// Read user by id
app.get('/api/user/:id', (req, res) => {
  (async () => {
      try {
        // select the individual document by specifying the path
        // https://googleapis.dev/nodejs/firestore/latest/DocumentSnapshot.html
        const document = await db.doc('user/' + req.params.id).get();
        return res.status(200).send(document.data());
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// Read user
app.get('/api/user', (req, res) => {
  (async () => {
      try {
          let query = db.collection('user');
          let selectedUsers = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  console.log(doc.data());
                  const selectedUser = {
                      uid: doc.data().uid,
                      firstName: doc.data().firstName,
                      lastName: doc.data().lastName,
                      score: doc.data().score,
                      admin: doc.data().admin
                  };
                  selectedUsers.push(selectedUser);
              }
              return selectedUsers;
          });
          return res.status(200).send(selectedUsers);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// Update user
app.put('/api/user/:uid', (req, res) => {
  (async () => {
      try {
          const document = db.collection('user').doc(req.params.uid);
          await document.update(req.body);
          return res.status(200).send();
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// TODO: add endpoint for delete user

// Create activity
app.post('/api/activity', (req, res) => {
  (async () => {
      try {
          await db.collection('activity').doc('/' + req.body.id + '/').create(req.body);
          return res.status(200).send();
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
    })();
});

// Read activity
app.get('/api/activity', (req, res) => {
  (async () => {
      try {
          let query = db.collection('activity');
          let selectedActivities = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const selectedActivity = {
                      firstName: doc.data().firstName,
                      lastName: doc.data().lastName,
                      uid: doc.data().uid,
                      activity: doc.data().activity,
                      description: doc.data().description,
                      link: doc.data().link,
                      points: doc.data().points,
                      id: doc.data().id,
                      cleared: true
                  };
                  selectedActivities.push(selectedActivity);
              }
              return selectedActivities;
          });
          return res.status(200).send(selectedActivities);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// Update activity
app.put('/api/activity/:id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('activity').doc(req.params.id);
          await document.update(req.body);
          return res.status(200).send();
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// Delete activity
app.delete('/api/activity/:id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('activity').doc(req.params.id);
          await document.delete();
          return res.status(200).send();
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// create high_score
app.post('/api/high_score', (req, res) => {
  (async () => {
      try {
        console.log(req.body);
          const toot = await db.collection('high_score').doc('/' + req.body.id + '/').create(req.body);
          return res.status(200).send();
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
    })();
});

// Read high_score
app.get('/api/high_score', (req, res) => {
  (async () => {
      try {
          let query = db.collection('high_score');
          let highScore = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const score = {
                      id: doc.data().id,
                      scoreTitle: doc.data().scoreTitle,
                      firstPlace: doc.data().firstPlace,
                      secondPlace: doc.data().secondPlace,
                      thirdPlace: doc.data().thirdPlace,
                  };
                  highScore.push(score);
              }
              highScore.sort((a,b) => {
                return b.id - a.id;
              });
              return highScore;
          });
          return res.status(200).send(highScore);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

  // TODO: create endpoint for update high_score

  // TODO: create endpoint for delete high_score

exports.app = functions.https.onRequest(app);
