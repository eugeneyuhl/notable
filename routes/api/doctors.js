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

// Get a list of doctors.
router.get('/all', (req, res) => {
    res.json(doctors);
})

// Get a list of all appointments for a particular doctor and particular day
// /appointments?doctorId=2&date=20180509
router.get('/appointments', (req, res) => {
    const doctorId = req.query.doctorId;
    const date = moment(req.query.date, "YYYYMMDD").format("MM/DD/YYYY").toString();

    const found = doctors.some(doc => doc.id === doctorId);
    if (!found) {
        res.status(400).json({
            msg: `Doctor with id ${doctorId} does not exist.`
        });
        return;
    }
    console.log(`Doctor with id ${doctorId} on ${date}`);

    var list = [];
    appointments.forEach(appointment => {
        if (appointment.doctorId === doctorId && appointment.date == date) {
            list.push(appointment);
        }
    })

    console.log(list);
    if (list) {
        res.json(list);
    } else {
        res.status(400).json({
            msg: `Doctor with id ${doctorId} does not have any appointments on ${date}.`
        });
    }
})

// Delete an existing appointment from a doctor's calendar
router.delete('/appointments', (req, res) => {
    const appointmentId = req.query.id;
    const found = appointments.some(appointment => appointment.id === appointmentId);

    if (!found) {
        res.status(400).json({
            msg: `Appointment id ${appointmentId} does not exist.`
        });
        return;
    }
    console.log(`Removing appointment id ${appointmentId}.`);

    const index = appointments.findIndex((appointment, i) => {
        return appointment.id == appointmentId;
    });
    appointments.splice(index, 1);

    res.json({
        msg: 'Appointment removed',
        appointments
    });
})

// Add a new appointment to a doctor's calendar
//   New appointments can only start at 15 minute intervals (ie, 8:15AM is a valid time
//   but 8:20AM is not)
//   A doctor can have multiple appointments with the same time, but no more than 3
//   appointments can be added with the same time for a given doctor

function checkValidTime(time) {
    let minute = moment(time, "HHmm").minutes();
    return minute % 15 === 0;
}

router.post('/appointments', (req, res) => {
    let timeMap = new Map();
    appointments.forEach(appointment => {
        if (req.query.doctorId == appointment.doctorId) {
            let appTime = moment(`${appointment.date} ${appointment.time}`, "MM/DD/YYYY hh:mm A").format("MM/DD/YYYY hh:mm A").toString();
            if (!timeMap.has(appTime)) {
                timeMap.set(appTime, 0);
            }
            console.log(appTime);
            timeMap.set(appTime, timeMap.get(appTime) + 1);
        }
    });
    var convertedDateTime = moment(`${req.query.date} ${req.query.time}`, "YYYYMMDD HHmm").format("MM/DD/YYYY hh:mm A").toString();
    if (!checkValidTime(req.query.time)) {
        res.json({
            msg: `Appointment time is not in 15 minute interval.`
        });
        return;
    }

    if (timeMap.has(convertedDateTime) && timeMap.get(convertedDateTime) >= 3) {
        res.json({
            msg: `Doctor has too many appointment at this time.`
        });
        return;
    }

    let convertedDate = moment(req.query.date, "YYYYMMDD").format("MM/DD/YYYY");
    let convertedTime = moment(req.query.time, "HHmm").format("hh:mm A");
    const newAppointment = {
        id: uuid.v4(),
        patientId: req.query.patientId,
        date: convertedDate,
        time: convertedTime,
        kind: kindMap[req.query.kind],
        doctorId: req.query.doctorId
    };

    appointments.push(newAppointment);
    timeMap.set(convertedDateTime, timeMap.get(convertedDateTime) + 1);
    res.json({
        msg: `New appointment is created.`,
        appointments
    })
})

module.exports = router;