const express = require('express');
const router = express.Router();

const Users = require("../models/user-model.js");

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base(process.env.AIRTABLE_BASE);

base('Users').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 300,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function (record) {
        // console.log('Retrieved', record.get('Référence'));
        // console.log(record.get('Style monture'));
        const Name = record.get('Name');
        const Fonction = record.get('Fonction');
        const Mail = record.get('Mail');

        // Users.create({ Name, Fonction, Mail })
        //   .then(console.log("created element in the database")
        //   )
        //   .catch(err => next(err));

    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();


}, function done(err) {
    if (err) { console.error(err); return; }
});


router.post("/users", (req, res, next) => {
    // Users.find()
    //     .then(response => {
    //         res.json(response);
    //     })
    //     .catch(err => next(err))
    const { firstName, fonction, email } = req.body;
    console.log('firstName', firstName);
    console.log('req.body', req.body);
    Users.create({ Name: firstName, Fonction: fonction, Mail: email })
        .then(console.log("created element in the database")
        )
        .catch(err => next(err));
});



module.exports = router;