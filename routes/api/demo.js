const express = require('express');
const router = express.Router();
const moment = require('moment');
const uuid = require('uuid');

let doctors = require('../../data/Doctors');
let appointments = require('../../data/Appointments');
let kindMap = {
    "1": "New Patient",
    "2": "Follow Up"
};

// 1: path, 2: function
router.get('', (req, res) => {

});

router.post('', (req, res) => {

});

router.delete('', (req, res) => {

});