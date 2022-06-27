const Practitioner= require('../model/Practitioner');
const bcrypt = require('bcrypt');

const getAllPractitioner= async (req, res) => {
    const patient = await Practitioner.find();
    if (!patient) return res.status(204).json({ 'message': 'No Practitionerfound.' });
    res.json(patient);
}


const newPractitionerHandler = async (req, res) => {
    const { name, address, phonenumber, password, confirm_password, email, country, state, city, contact_person } = req.body;

    const validationErrors = {};

    if (!name)
        validationErrors.name = 'Name is required.';
    if (!address)
        validationErrors.address = 'Address is required.';
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
    if (!contact_person)
        validationErrors.contact_person = 'Contact Person is required.';
 
    if (Object.keys(validationErrors).length > 0)
        return res.status(400).json({ 'validation_error': validationErrors }); 
 


    // check for duplicate usernames in the db
    const duplicate = await Practitioner.findOne({
        $or: [{ email }, {phonenumber} ]
    }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        const date = new Date(dob)
        //create and store the new user
        const result = await Practitioner.create({ firstname, lastname, phonenumber, email, country, state, city, gender, date, password });

        console.log(result);

        res.status(201).json({ 'success': `New patient ${firstname} ${lastname} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updatePractitioner= async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const owner = await Practitioner.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.body.id}.` });
    }
    if (req.body?.name) owner.name = req.body.name;
    if (req.body?.address) owner.address = req.body.address;
    if (req.body?.phonenumber) owner.phonenumber = req.body.phonenumber;
    if (req.body?.email) owner.email = req.body.email;
    if (req.body?.country) owner.country = req.body.country;
    if (req.body?.state) owner.state = req.body.state;
    if (req.body?.city) owner.city = req.body.city;
    if (req.body?.contact_person) owner.contact_person = req.body.contact_person;

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

    const owner = await Practitioner.findOne({ _id: req.params.id }).exec();
    owner.password = hashedPwd;
    const result = await owner.save()
    res.json(result);
}


const deletePractitioner= async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'PractitionerID required.' });

    console.log(req.params.id )
    const owner = await Practitioner.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.body.id}.` });
    }
    const result = await owner.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}


const getPractitioner= async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'PractitionerID required.' });

    const owner = await Practitioner.findOne({ _id: req.params.id }).exec();
    if (!owner) {
        return res.status(204).json({ "message": `No owner matches ID ${req.params.id}.` });
    }
    res.json(owner);
}

module.exports = { newPractitionerHandler, getAllPractitioner, getPractitioner, updatePassword, updatePractitioner, deletePractitioner};