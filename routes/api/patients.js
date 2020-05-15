const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const patients = require('../../data/Patients');

// Show the list of members.
router.get('/', (req, res) => {
    res.json(patients);
})

// Add the new patient.
router.post('/', (req, res) => {
    const newPatient = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
        return res.status(400).json({ msg: 'Please include a name, email, and phone number for the patient.' });
    }
    patients.push(newPatient);
    res.json(patients);
})

router.delete('/:id', (req, res) => {
    const found = patients.some(patient => patient.id == req.params.id);

    if (found) {
        const index = patients.findIndex((patient, i) => {
            return patient.id == req.params.id;
        });
        patients.splice(index,1);

        res.json({
            msg: 'Patient removed',
            patients
        });
    } else {
        res.status(400).json({ msg: `No patient with the id of ${req.params.id} found.` });
    }
});

// router.delete('/:name', (req, res) => {
//     const found = patients.some(patient => patient.name === req.params.name);

//     if (found) {
//         const index = patients.findIndex((patient, i) => {
//             return patient.name === req.params.name;
//         });
//         patients.splice(index,1);

//         res.json({
//             msg: 'Patient removed',
//             patients
//         });
//     } else {
//         res.status(400).json({ msg: `No patient with the name of ${req.params.id} found.` });
//     }
// });

module.exports = router;