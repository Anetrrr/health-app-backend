const Owner = require('../model/Owner');
const bcrypt = require('bcrypt');



const handleNewInstaller = async (req, res) => {
    const { firstname, lastname, phonenumber, email, username, pwd } = req.body;
    switch (req.body) {
        case value:
            
            break;
    
        default:
            break;
    }
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Owner.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await Owner.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { handleNewInstaller };