const Patient = require('../model/Patient');
const bcrypt = require('bcrypt');

const getAllPatient = async (req, res) => {
    const patient = await Patient.find();
    if (!patient) return res.status(204).json({ 'message': 'No Patient found.' });
    res.json(patient);
}

const newPatientHandler = async (req, res) => {
    const { firstname, lastname, phonenumber, email, country, state, city, gender, dob, password, confirm_password } = req.body;

    const validationErrors = {};

    if (!firstname)
        validationErrors.firstname = 'Firstname is required.';
    if (!lastname)
        validationErrors.lastname = 'Lastname is required.';
    if (!phonenumber)
        validationErrors.phonenumber = 'Phone Number is required.';
    if (phonenumber && !/^(0|[1-9][0-9]{0,2}(?:(,[0-9]{3})*|[0-9]*))(\.[0-9]+){0,1}$/.test(Number(phonenumber)))
        validationErrors.phonenumber = 'Phone number should be an integer.';
    if (!email)
        validationErrors.email = 'Email is required.';
    if (!password)
        validationErrors.password = 'Password is required.';
    if (!confirm_password)
        validationErrors.confirm_password = 'Confirm Password is required.';
    if (password !== confirm_password)
        validationErrors.password_mismatch = 'Passowrd and Confirm Password do not match.'; 
    if (!country)
        validationErrors.country = 'Country is required.';
    if (!state)
        validationErrors.state = 'State is required.';
    if (!city)
        validationErrors.city = 'City is required.';
    if (!gender)
        validationErrors.gender = 'Gender is required.';
    if (!dob)
        validationErrors.dob = 'Date Of Birth is required.';
    
    if (Object.keys(validationErrors).length > 0)
        return res.status(400).json({ 'validation_error': validationErrors }); 
 


    // check for duplicate usernames in the db
    const duplicate = await Patient.findOne({
        $or: [{ email }, {phonenumber} ]
    }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        const date = new Date(dob)
        //create and store the new user
        const result = await Patient.create({ firstname, lastname, phonenumber, email, country, state, city, gender, date, password });

        console.log(result);

        res.status(201).json({ 'success': `New patient ${firstname} ${lastname} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updatePatient = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const owner = await Patient.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) owner.firstname = req.body.firstname;
    if (req.body?.lastname) owner.lastname = req.body.lastname;
    if (req.body?.phonenumber) owner.phonenumber = req.body.phonenumber;
    if (req.body?.email) owner.email = req.body.email;
    if (req.body?.country) owner.country = req.body.country;
    if (req.body?.state) owner.state = req.body.state;
    if (req.body?.city) owner.city = req.body.city;
    if (req.body?.gender) owner.gender = req.body.gender;
    if (req.body?.dob) owner.dob = req.body.dob;
    const result = await owner.save();
    res.json(result);
}

const updatePassword = async (req, res) => {
    const {password, confirm_password} = req.body
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    if(!password)
        return res.status(400).json({ 'message': 'Password field is required.' });
    
    if(!confirm_password)
        return res.status(400).json({ 'message': 'Confirm Password field is required.' });
    
    if (password !== confirm_password) return res.status(400).json("Password and Confirm Password fields do not match");

    const hashedPwd = await bcrypt.hash(password, 10); 

    const owner = await Patient.findOne({ _id: req.params.id }).exec();
    owner.password = hashedPwd;
    const result = await owner.save()
    res.json(result);
}


const deletePatient = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Patient ID required.' });

    console.log(req.params.id )
    const owner = await Patient.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.body.id}.` });
    }
    const result = await owner.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}


const getPatient = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Patient ID required.' });

    const owner = await Patient.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.params.id}.` });
    }
    res.json(owner);
}



module.exports = { newPatientHandler, getAllPatient, getPatient, updatePassword, updatePatient, deletePatient };