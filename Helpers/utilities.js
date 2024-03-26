//dependencies
const {createHmac} = require('node:crypto');
const environment = require('./enviornment');
//scaffolding
const utilities = {};
//making string to valid json object
utilities.validJSON = (jsonString)=>{
    let validObj = {};
    try {
        validObj = JSON.parse(jsonString);
    } catch (error) {
        validObj = {};
    }
    return validObj;
};

//making string to SHA-256 hash value
utilities.hashString = (inputString)=>{
    const hash = createHmac('sha256',environment.secretKey)
                .update(inputString)
                .digest('hex');
    return hash;
};

//generating unique tokens
utilities.generateToken = (size)=>{
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+';
    let token = '';
    for(let i=1; i<=size; i++){
        token+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return token;
};



module.exports = utilities;