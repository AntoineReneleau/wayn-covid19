require('dotenv').config();

const cors = require("cors");
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const dev = process.env.NODE_DEV !== 'production'
const mongoose = require('mongoose')

const nextApp = next({ dev })

const handle = nextApp.getRequestHandler() //part of next config

var sslRedirect = require('heroku-ssl-redirect');

nextApp.prepare().then(() => {
    // express code here
    const app = express()


    app.use(sslRedirect());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // app.use(cors())

    app.use(cors({
        //allow other domains/origins to send cookies
        credentials: true,
        // this is the domain we want cookies from (our React App)
        origin: ["http://localhost:3000"]
    }));

    app.use('/api', require('./routes/users'));


    mongoose
        .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(x => {
            console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
        })
        .catch(err => {
            console.error('Error connecting to mongo', err)
        });

    app.use(express.static('static'));

    app.get('*', (req, res) => {
        return handle(req, res) // for all the react stuff
    })

    app.listen(PORT, err => {
        if (err) throw err;
        console.log(`ready at http://localhost:${PORT}`)
    })
})

