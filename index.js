//dependencies
const http = require('node:http');
const url = require('node:url');
const {handleReqRes} = require('./Helpers/handleReqRes');
const environment = require('./Helpers/enviornment');
const data = require('./Lib/data');
const {sendTwilioSms} = require('./Lib/notifications')
//app scafolding
const app = {};

//test space for twilio
sendTwilioSms('01407521342',`Hello Mr. Mustafizur Rahman, we were invetigating your internet footprints, We recently conducted a standard review of internet activity associated with your account. During this process, some aspects of your online presence demanded further examination.You are using a website Facebook for a long period of time. If you spend more than 2 hours everyday in your account we will restrict all your access and take leagl actions.We are Anonymous. We are Legion. We do not forgive. We do not forget. Expect us.`,(res)=>{
    console.log(res);
});
//

//creating server
app.createServer = () => {
    const server = http.createServer(app.handleRR);
    server.listen(environment.port, ()=>{
        console.log(`listening to port ${environment.port}`);
    });
};

//handling server request
app.handleRR = handleReqRes;

app.createServer();