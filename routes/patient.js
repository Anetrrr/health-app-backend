const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/', patientController.newPatientHandler);
router.get('/', patientController.getAllPatient);
router.put('/', patientController.updatePatient);




module.exports = router;