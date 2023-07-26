const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const express = require("express");
const app = express();

admin.initializeApp();

exports.sendNotificationToAll = onRequest(async (req, res) => {
  const { title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
  };

  try {
    const deviceTokensSnapshot = await admin
      .firestore()
      .collection("devices")
      .get();
    const deviceTokens = deviceTokensSnapshot.docs.map(
      (doc) => doc.data().token
    );

    if (deviceTokens.length === 0) {
      console.log("No device tokens found. Skipping notification.");
      return res.json({
        message: "No device tokens found. Skipping notification.",
      });
    }

    const response = await admin.messaging().sendMulticast({
      tokens: deviceTokens,
      notification: message.notification,
    });

    console.log("Notification sent to all subscribers:", response);
    return res.json({ message: "Notification sent to all subscribers" });
  } catch (error) {
    console.error("Error sending notification to all subscribers:", error);
    return res
      .status(500)
      .json({ error: "Error sending notification to all subscribers" });
  }
});

exports.create = onRequest((request, response) => {
  // Get the JSON data from the request body
  const jsonData = request.body;

  // Validate JSON data
  if (!jsonData) {
    return response
      .status(400)
      .send("JSON data is required in the request body.");
  }

  try {
    // Loop through the JSON object keys (collection names)
    Object.keys(jsonData).forEach((collectionName) => {
      // Get the documents for each collection
      const documents = jsonData[collectionName];

      // Write documents to Firestore
      documents.forEach(async (document) => {
        try {
          await admin.firestore().collection(collectionName).add(document);
        } catch (error) {
          console.error(
            `Error writing document to collection '${collectionName}':`,
            error
          );
        }
      });
    });

    return response
      .status(200)
      .send("Firestore collections created successfully.");
  } catch (error) {
    console.error("Error generating Firestore collections:", error);
    return response.status(500).send("Internal server error.");
  }
});

// app.post("/:eventType", async (req, res) => {
//   const eventType = req.params.eventType;
//   const { event, collections } = req.body;

//   try {
//     const createdEvent = await admin
//       .firestore()
//       .collection(eventType)
//       .add(event);

//     Object.keys(collections)
//       .slice("images")
//       .slice("team")
//       .forEach((collectionName) => {
//         const documents = collections[collectionName];

//         documents.forEach(async (document) => {
//           await admin
//             .firestore()
//             .collection(eventType)
//             .doc(createdEvent.id)
//             .collection(collectionName)
//             .add(document);
//         });
//       });
//   } catch (error) {
//     console.error(
//       `Error writing document to collection '${eventType}':`,
//       error
//     );
//   }

//   res.status(200).send({ event: true });
// });

app.post("/:eventType", async (req, res) => {
  const eventType = req.params.eventType;
  req.body.forEach(async (element) => {
    const { event, collections } = element;

    try {
      const createdEvent = await admin
        .firestore()
        .collection(eventType)
        .add(event);

      Object.keys(collections).forEach((collectionName) => {
        const documents = collections[collectionName];

        documents.forEach(async (document) => {
          await admin
            .firestore()
            .collection(eventType)
            .doc(createdEvent.id)
            .collection(collectionName)
            .add(document);
        });
      });
    } catch (error) {
      console.error(
        `Error writing document to collection '${eventType}':`,
        error
      );
    }
  });

  res.status(200).send({ event: true });
});

app.get("/:eventType", async (req, res) => {
  const eventType = req.params.eventType;

  try {
    const eventsSnapshot = await admin.firestore().collection(eventType).get();

    const events = eventsSnapshot.docs.map((doc) => doc.data());

    res.status(200).send({ events });
  } catch (error) {
    console.error(
      `Error writing document to collection '${eventType}':`,
      error
    );
  }
});

exports.createEvent = onRequest(app);
