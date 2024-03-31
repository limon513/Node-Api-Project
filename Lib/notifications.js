//dependencies
const https = require('https');
const {twilio} = require('../Helpers/enviornment')
const querystring =require('querystring')
//scaffolding
const notification = {};

//
notification.sendTwilioSms = (phoneNum,SMS,callback)=>{
    //parameter validation
    const reciverNum = typeof(phoneNum)==='string' && phoneNum.trim().length === 11 ?
                        phoneNum.trim():false;
    const message = typeof(SMS) === 'string' && SMS.length>0 && SMS.length<=1600 ?
                    SMS : false;
    if(reciverNum && message){
        const payload = {
            To : `+88${reciverNum}`,
            From : twilio.from,
            Body : message,
        };
        const payloadString = querystring.stringify(payload);
        const options = {
            hostname:'api.twilio.com',
            method:'POST',
            path:`/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth:`${twilio.accountSid}:${twilio.authToken}`,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
        };
        const req = https.request(options,(res)=>{
            const statusCode = res.statusCode;
            if(statusCode===200 || statusCode===201){
                callback(false);
            }else{
                callback(`respose with status code ${statusCode}`);
            }
        });
        req.on('error',(error)=>{
            if(error){
                console.log(error);
            }
        });
        req.write(payloadString);
        req.end();
    }
    else{
        callback('phone number invalid!');
    }
}


//export
module.exports = notification;