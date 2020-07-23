#!/usr/bin/env nodemon
const express = require('express');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser')
const fs = require('fs');

// Create Express app
const app = express();
const mainapp = require('./src/index')

// Express Modules
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api', mainapp)
app.listen(4000,()=>console.log('4000'))