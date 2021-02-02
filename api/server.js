require("dotenv").config();
const availableLanguages = require("./langdata.js");
const Name = require("./models/name");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

// Sendgrid Integration
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
let currentUser = {};

// Google Cloud Translate
const { Translate } = require("@google-cloud/translate");
const translate = new Translate({
  projectId: process.env.PROJECT_ID,
});

// Load Languages
const targets = Object.keys(availableLanguages);

// Mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log(err));

// Node up
app.listen(port, () => console.log(`listening on port ${port}`));

// Bodyparser Middleware
app.use(bodyParser.json({ limit: "25mb", extended: true }));

// Translation Retrieval Functions
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const start = async (qName) => {
  let myTranslations = [];
  await asyncForEach(targets, async (lang) => {
    await translate
      .translate(qName, lang)
      .then((results) => {
        const translation = results[0];
        myTranslations.push({
          language: availableLanguages[lang],
          translation: `${translation}`,
        });
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  });
  return myTranslations;
};

// Translation Retrieval Endpoint
// Takes firstname, saves translation Object to MongoDB & returns
app.get("/lingolab", (req, res) => {
  Name.findOne({ name: req.query.name }, function (err, existingName) {
    if (err) {
      console.error(err);
    }
    if (!existingName) {
      console.log("Doesnt exist!", existingName);
      start(req.query.name)
        .then((results) => {
          // console.log("RESULTS", results);
          let filtered = [];
          results.forEach((item, index, object) => {
            if (
              item.translation.toLowerCase() != req.query.name.toLowerCase()
            ) {
              filtered.push(item);
            }
          });
          // Filter if both Chinese are the same?
          // console.log("RESULTS, filtered", req.query.name, filtered);
          let newTranslationEntry = new Name({
            name: req.query.name,
            translations: filtered,
          });
          if (filtered.length > 0) {
            newTranslationEntry
              .save()
              .then((data) => {
                res.send({ express: data });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      console.log("Exists", existingName);
      res.send({ express: existingName, skipThanks: true });
    }
  });
});

app.post("/print", (req, res) => {
  // Make sure not sending duplicates
  if (JSON.stringify(req.body) === JSON.stringify(currentUser)) {
    return;
  }
  currentUser = req.body;

  let pdfToSend = req.body.pdf.replace(
    "data:application/pdf;filename=printout.pdf;base64,",
    ""
  );
  const capitalize = (lowered) => {
    return lowered.charAt(0).toUpperCase() + lowered.slice(1);
  };

  let sendGridTemplatedPDF = {
    to: req.body.user.email,
    from: "noreply@wycliffe.org",
    templateId: "d-644327f26913447fa28703268af752a4",
    dynamic_template_data: {
      firstname: capitalize(req.body.user.fname),
      wycliffe: {
        name: "Wycliffe Bible Translators",
        address01: "11221 John Wycliffe Blvd.",
        city: "Orlando",
        state: "FL",
        zip: "32832",
        phone: "(407) 852-2600 ext 4054",
      },
    },
    attachments: [
      {
        filename: req.body.printname + "-Wycliffe-DC-Printout.pdf",
        content: pdfToSend,
      },
    ],
  };

  sgMail
    .send(sendGridTemplatedPDF)
    .then(() => {
      console.log("Sengrid email sent: ", req.body.user);
      res.send({
        status: "success",
      });
    })
    .catch((error) => {
      console.error(error.toString());
      res.send({
        status: "error",
      });
      const { message, code, response } = error;
      const { headers, body } = response;
    });
});
