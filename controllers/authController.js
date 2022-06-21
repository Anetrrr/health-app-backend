const Vehicle = require('../model/Vehicle');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Owner = require('../model/Owner');

const handleLogin = async (req, res) => {
    
    const { vehicle_number, password } = req.body;
    if (!vehicle_number || !password) return res.status(400).json({ 'message': 'Vehicle Number and password are required.' });

    const foundVehicle = await Vehicle.findOne({ vehicle_number }).exec();
    if (!foundVehicle) return res.sendStatus(401); //Unauthorized
  
    //find owner
    const foundOwner = await Owner.findOne({ _id: foundVehicle.owner }).exec()


    // evaluate password 
    // const owner = await Owner.findOne({id: foundVehicle})
    const match = await bcrypt.compare(password, foundOwner.password);
    if (match) {
        // const roles = Object.values(foundVehicle.owner).filter(Boolean);

        // create JWTs
        const accessToken = jwt.sign(
            { "vehicle_number": foundVehicle.vehicle_number },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );

        const refreshToken = jwt.sign(
            { "vehicle_number": foundVehicle.vehicle_number },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current Vehicle
        foundVehicle.refreshToken = refreshToken;
        const result = await foundVehicle.save();
        console.log(result);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to User
        res.json({ accessToken, vehicle_number });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };