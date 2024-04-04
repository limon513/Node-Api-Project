//dependencies
const fileWork = require('../Lib/data');
const {validJSON} = require('../Helpers/utilities')
const http = require('node:http');
const https = require('node:https');
const {sendTwilioSms} = require('./notifications');
//server scafolding
const worker = {};
//

//twilio message portion after aleart 
worker.alertUserToStateChange = (newCheckObj)=>{
    const msg = `Alert : Your check for ${newCheckObj.method.toUpperCase()}
                 ${newCheckObj.protocol}://${newCheckObj.url} is currently ${newCheckObj.state}!!`;
    sendTwilioSms(newCheckObj.userPhone,msg,(err1)=>{
        if(!err1){
            console.log("user has been alerted to status change!");
        }else{
            console.log("there was a problem sending sms to user!");
        }
    });
};

//process based what outcome has generated;
worker.processCheckOutcome = (singleCheckObj, checkOutcome)=>{
    const checkState = !checkOutcome.error && checkOutcome.responseCode &&
                singleCheckObj.successcode.indexOf(checkOutcome.responseCode) != -1 ?
                'up' : 'down';
    
    const alert  = singleCheckObj.lastChecked && singleCheckObj.lastChecked>0 &&
                    checkState !== singleCheckObj.state ? true : false;

    const newCheckObj = singleCheckObj;
    newCheckObj.state = checkState;
    newCheckObj.lastChecked = Date.now();
    fileWork.update('checks',singleCheckObj.id,newCheckObj,(err1)=>{
        if(!err1){
            if(alert){
                worker.alertUserToStateChange(newCheckObj);
            }else{
                console.log('Check State not changed, no alert need!');
            }
        }else{
            console.log('Error trying save new check data!');
        }
    });
};

//perform check
worker.performCheck = (singleCheckObj)=>{
    const parsedUrl = new URL(singleCheckObj.protocol + '://' + singleCheckObj.url);
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.pathname;

    const options = {
        hostname: hostname,
        path : path,
        method : singleCheckObj.method.toUpperCase(),
        timeout : singleCheckObj.timeout*1000,
    };

    let checkOutcome = {
        error : false,
        responseCode : false,
    };

    let checkOutComeSent = false;

    const protocolToUse = singleCheckObj.protocol === 'http' ? http : https;

    const req = protocolToUse.request(options,(res)=>{
        const statusCode = res.statusCode;
        checkOutcome.responseCode = statusCode;
        console.log(statusCode);
        if(!checkOutComeSent){
            worker.processCheckOutcome(singleCheckObj,checkOutcome);
            checkOutComeSent = true;
        }
    });

    req.on('error',(e)=>{
        checkOutcome={
            error: true,
            value: e,
        };
        if(!checkOutComeSent){
            worker.processCheckOutcome(singleCheckObj,checkOutcome);
            checkOutComeSent = true;
        }
    });

    req.on('timeout',()=>{
        checkOutcome = {
            error : true,
            value : 'timeout',
        };
        if(!checkOutComeSent){
            worker.processCheckOutcome(singleCheckObj,checkOutcome);
            checkOutComeSent = true;
        }
    });

    req.end(); 

};

//validate every check before 
worker.validateCheck = (checkObjs)=>{
    const singleCheckObj = checkObjs;
    singleCheckObj.state = singleCheckObj.state && typeof(singleCheckObj.state)==='string' && ['up','down'].indexOf(singleCheckObj.state) != -1
                            ?singleCheckObj.state : 'down';
    singleCheckObj.lastChecked =singleCheckObj.lastChecked && typeof(singleCheckObj.lastChecked)==='number' && singleCheckObj.lastChecked>0 ?
                                singleCheckObj.lastChecked : false;
    worker.performCheck(singleCheckObj);
};

//lookup for the checks and perform on them
worker.gatherAllChecks = ()=>{
    fileWork.listDirItem('checks',(err1,checklist)=>{
        if(!err1 && checklist){
            for(let i=0; i<checklist.length; i++){
                fileWork.read('checks',checklist[i],(err2,cd)=>{
                    if(!err2 && cd){
                        //pass checkObj to validate.
                        worker.validateCheck(validJSON(cd));
                    }else{
                        console.log('Error reading checks data!');
                    }
                });
            }
        }else{
            console.log(err1);
        }
    });
};

//looping the worker for every minutie
worker.loop = ()=>{
    setInterval(() => {
        worker.gatherAllChecks();
    }, 10000); 
};
//initialize worker
worker.init = ()=>{
    //
    worker.gatherAllChecks();
    //
    worker.loop();
};

module.exports = worker;