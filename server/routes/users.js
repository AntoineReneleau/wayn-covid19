const express = require('express');
const router = express.Router();

const Users = require("../models/user-model.js");

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base(process.env.AIRTABLE_BASE);
var humanRessources = {};
var skills = {};
var jobs   = {};

base('Ressources humaines').select({
    // Selecting the 3 only records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record) {
        const branch1 = record.get('Branche1');
        const branch2 = record.get('Branche2: Expérience / Capable de');
        humanRessources[branch1] = branch2
        // Users.create({ Name, Fonction, Mail })
        //   .then(console.log("created element in the database")
        //   )
        //   .catch(err => next(err));
    });

    // console.log("")
    // console.log("Debug: Fetch ressources from Airtable")
    // console.log( humanRessources)
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
}, function done(err) {
    if (err) { console.error(err); return; }
});

base('Compétences').select({
    // Selecting the 3 only records in Grid view:
    maxRecords: 300,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record) {
        const keys = Object.keys( record.fields )
        for( let key of keys){
            value = record.fields[key]
            if(skills[key] == undefined){
                skills[key] = []    
            }
            skills[key].push(value)
        }
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
}, function done(err) {
    if (err) { console.error(err); return; }
});

base('Jobs').select({
    // Selecting the 3 only records in Grid view:
    maxRecords: 300,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function (record) {
        const keys = Object.keys( record.fields )
        for( let key of keys){
            value = record.fields[key]
            if(jobs[key] == undefined){
                jobs[key] = []    
            }
            jobs[key].push(value)
        }
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
}, function done(err) {
    if (err) { console.error(err); return; }
});

router.get("/ressources", (req, res, next) => {
    // Send back ressources found on Airtable
    // console.log()
    // console.log("Debug: Server-side")
    // console.log("Ressources requested")
    // console.log(humanRessources)
    res.json({
        humanRessources: humanRessources,
        jobs  : jobs,
        skills: skills   
    })
    //
    next()
});

router.post("/whereto", (req, res, next) => {
    // Send back ressources found on Airtable
    console.log()
    console.log("Debug: Server-side")
    console.log("Where to requested")
    //
    request      = req.body
    request.data = null
    console.log(request)
    res.json( [] )
    //
    next()
});

router.get("/ressources", (req, res, next) => {
    // Send back ressources found on Airtable
    // console.log()
    // console.log("Debug: Server-side")
    // console.log("Ressources requested")
    // console.log(humanRessources)
    res.json(humanRessources)
    //
    next()
});

router.post("/whereto", (req, res, next) => {
    // Send back ressources found on Airtable
    console.log()
    console.log("Debug: Server-side")
    console.log("Where to requested")
    //
    request      = req.body
    request.data = null
    console.log(request)
    res.json(["Stay home", "Nowhere"])
    //
    next()
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

router.get("/users-fetch", (req, res, next) => {
    // Users.find()
    //     .then(response => {
    //         res.json(response);
    //     })
    //     .catch(err => next(err))
    const { firstName } = req.body;
    // console.log('firstName', firstName);
    // console.log('req.body', req.body);
    Users.create({ Name: firstName, Fonction: fonction, Mail: email })
        .then(console.log("created element in the database")
        )
        .catch(err => next(err));
});



module.exports = router;