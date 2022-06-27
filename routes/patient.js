const express = require('express');
const router = express.Router();
const { newPatientHandler, getAllPatient, getPatient, updatePassword, updatePatient } = require('../controllers/patientController');

router.post('/', newPatientHandler)
    .get('/', getAllPatient)
    .get('/:id', getPatient)
    .put('/:id', updatePatient)
    .patch('/update_password', updatePassword);

module.exports = router;

