//dependencies
const fileWork = require('../../Lib/data');
const utilities = require('../../Helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { timeoutLimit, tokenLength, checkIdLength, maxcheckLength } = require('../../Helpers/enviornment');
//scaffolding
const handler = {};
//making user handler
handler.checkHandler = (requestProperty, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperty.method) != -1) {
        handler._check[requestProperty.method](requestProperty, callback);
    } else {
        callback(405);
    }
};

//another scaffolding
handler._check = {};
//defining methods for request types
handler._check.post = (requestProperty, callback) => {
    const protocol = typeof (requestProperty.body.protocol) === 'string' &&
        ['http', 'https'].indexOf(requestProperty.body.protocol.trim()) != -1 ?
        requestProperty.body.protocol.trim() : false;

    const url = typeof (requestProperty.body.url) === 'string' &&
        requestProperty.body.url.trim().length > 0 ?
        requestProperty.body.url.trim() : false;

    const method = typeof (requestProperty.body.method) === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(requestProperty.body.method.trim().toLowerCase()) != -1 ?
        requestProperty.body.method.trim().toLowerCase() : false;

    const successcode = typeof (requestProperty.body.successcode) === 'object' &&
        requestProperty.body.successcode instanceof Array ?
        requestProperty.body.successcode : false;

    const timeout = typeof (requestProperty.body.timeout) === 'number' &&
        Math.floor(requestProperty.body.timeout) <= timeoutLimit ?
        requestProperty.body.timeout : false;

    const token = typeof (requestProperty.headersObj.token) === 'string' &&
            requestProperty.headersObj.token.trim().length === tokenLength ?
            requestProperty.headersObj.token.trim() : false;

    if (protocol && url && method && successcode && timeout) {

        if (token) {
            fileWork.read('tokens', token, (err1, td) => {
                const tokenObj = utilities.validJSON(td);
                const checkObj = {
                    id: utilities.generateToken(checkIdLength),
                    protocol,
                    url,
                    method,
                    successcode,
                    timeout,
                    userPhone:tokenObj.phone,
                };
                if (!err1 && tokenObj && tokenObj.expires > Date.now()) {
                    fileWork.read('users', tokenObj.phone, (err2, ud) => {
                        const userData = { ...utilities.validJSON(ud) };
                        if (!err2 && userData) {
                            const userChecks = typeof (userData.checks) === 'object' &&
                                userData.checks instanceof Array ?
                                userData.checks : [];
                            if (userChecks.length < maxcheckLength) {
                                fileWork.create('checks', checkObj.id, checkObj, (err3) => {
                                    if (!err3) {
                                        userData.checks = userChecks;
                                        userData.checks.push(checkObj.id);
                                        fileWork.update('users', userData.phone, userData, (err4) => {
                                            if (!err4) {
                                                callback(200, {
                                                    message: "check added!",
                                                    checkObj,
                                                });
                                            } else {
                                                callback(500, { error: "SWR!" });
                                            }
                                        });
                                    } else {
                                        callback(500, { error: "something went wrong creating checks" });
                                    }
                                });
                            } else {
                                callback(400, { error: "max check limit reached!" });
                            }
                        } else {
                            callback(500, { error: "something went wrong user not found!" });
                        }
                    });
                } else {
                    callback(403, { error: "authentication failed! or session expired!" });
                }
            });
        } else {
            callback(403, { error: "authentication failed!" });
        }
    } else {
        callback(400, { error: 'critaria not matching for checking!' });
    }
};

handler._check.get = (requestProperty, callback) => {
    const token = typeof (requestProperty.headersObj.token) === 'string' &&
        requestProperty.headersObj.token.trim().length === tokenLength ?
        requestProperty.headersObj.token.trim() : false;
    if (token) {
        fileWork.read('tokens', token, (err1, td) => {
            const tokenData = utilities.validJSON(td);
            if (!err1 && tokenData) {
                const queryObj = new URLSearchParams(requestProperty.queryStringObj);
                let checkId = queryObj.get('id');
                handler._check.ChecksCheck(checkId,tokenData.phone,(successCheck,cd)=>{
                    if(successCheck && cd){
                        callback(200,utilities.validJSON(cd));
                    }else{
                        callback(400,{error:"no such checks!"});
                    }
                });
            } else {
                callback(403, { error: "authintication problem!" });
            }
        });
    } else {
        callback(403, { error: "authintication problem!" });
    }
};

handler._check.put = (requestProperty, callback) => {
    const checkId = typeof (requestProperty.body.checkid) === 'string' &&
    requestProperty.body.checkid.trim().length === checkIdLength ?
    requestProperty.body.checkid.trim() : false;
    
    const protocol = typeof (requestProperty.body.protocol) === 'string' &&
        ['http', 'https'].indexOf(requestProperty.body.protocol.trim()) != -1 ?
        requestProperty.body.protocol.trim() : false;

    const url = typeof (requestProperty.body.url) === 'string' &&
        requestProperty.body.url.trim().length > 0 ?
        requestProperty.body.url.trim() : false;

    const method = typeof (requestProperty.body.method) === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(requestProperty.body.method.trim().toLowerCase()) != -1 ?
        requestProperty.body.method.trim().toLowerCase() : false;

    const successcode = typeof (requestProperty.body.successcode) === 'object' &&
        requestProperty.body.successcode instanceof Array ?
        requestProperty.body.successcode : false;

    const timeout = typeof (requestProperty.body.timeout) === 'number' &&
        Math.floor(requestProperty.body.timeout) <= timeoutLimit ?
        requestProperty.body.timeout : false;
    
    if(checkId){
        const token = typeof (requestProperty.headersObj.token) === 'string' &&
        requestProperty.headersObj.token.trim().length === tokenLength ?
        requestProperty.headersObj.token.trim() : false;
        if(token){
            fileWork.read('tokens', token, (err1, td) => {
                if(!err1 && td){
                    const tokenData = utilities.validJSON(td);
                    handler._check.ChecksCheck(checkId,tokenData.phone,(success,ccd)=>{
                        if(success){
                            if(protocol || url || successcode || method || timeout){
                                fileWork.read('checks',checkId,(err2,cd)=>{
                                    if(!err2 && cd){
                                        let checkObj = {...utilities.validJSON(cd)};
                                        if(protocol){
                                            checkObj.protocol = protocol;
                                        }
                                        if(url){
                                            checkObj.url = url;
                                        }
                                        if(method){
                                            checkObj.method = method;
                                        }
                                        if(successcode){
                                            checkObj.successcode = successcode;
                                        }
                                        if(timeout){
                                            checkObj.timeout = timeout;
                                        }
                                        fileWork.update('checks',checkId,checkObj,(err3)=>{
                                            if(!err3){
                                                callback(200,{message:"checks updated successfull!"});
                                            }
                                            else{
                                                callback(500,{error:"something went wrong!"});
                                            }
                                        });
                                    }else{
                                        callback(500,{error:"something went wrong!"});
                                    }
                                });
                            }else{
                                callback(400,{error:"check request invalid!"});
                            }
                        }else{
                            callback(400,{error:"check request invalid!"});
                        }
                    });
                }else{
                    callback(500,{error:"something went wrong!"});
                }
            });
        }else{
            callback(403,{error:"authintication error!"});
        }
    }else{
        callback(400,{error:"invalid request!"});
    }
};

handler._check.delete = (requestProperty, callback) => {
    const token = typeof (requestProperty.headersObj.token) === 'string' &&
        requestProperty.headersObj.token.trim().length === tokenLength ?
        requestProperty.headersObj.token.trim() : false;
    if (token) {
        fileWork.read('tokens', token, (err1, td) => {
            if (!err1 && td) {
                const tokenData = utilities.validJSON(td);
                const queryObj = new URLSearchParams(requestProperty.queryStringObj);
                let checkId = queryObj.get('id');
                handler._check.ChecksCheck(checkId,tokenData.phone,(successCheck,cd)=>{
                    if(successCheck && cd){
                        fileWork.delete('checks',checkId,(err2)=>{
                            if(!err2){
                                fileWork.read('users',tokenData.phone,(err3,ud)=>{
                                    if(!err3 && ud){
                                        let userData = {...utilities.validJSON(ud)};
                                        const checkPos = userData.checks.indexOf(checkId);
                                        if(checkPos != -1){
                                            userData.checks.splice(checkPos,1);
                                            fileWork.update('users',userData.phone,userData,(err4)=>{
                                                if(!err4){
                                                    callback(200);
                                                }else{
                                                    callback(500);
                                                }
                                            });
                                        }else{
                                            callback(400,{error:"no such checks"});
                                        }
                                    }else{
                                        callback(500,{error:"something went wrong"});
                                    }
                                });
                            }else{
                                callback(400,{error:"no such checks"});
                            }
                        });
                    }else{
                        callback(400,{error:"no such checks!"});
                    }
                });
            } else {
                callback(403, { error: "authintication problem!" });
            }
        });
    } else {
        callback(403, { error: "authintication problem!" });
    }
};

handler._check.ChecksCheck = (checkId,phone,callback) => {
    checkId = typeof (checkId) === 'string' && checkId.trim().length === checkIdLength ?
        checkId.trim() : false;
    if (checkId) {
        fileWork.read('checks',checkId,(err1,cd)=>{
            if(!err1 && cd){
                fileWork.read('users',phone,(err2,ud)=>{
                    const userData = utilities.validJSON(ud);
                    if(!err2 && userData && "checks" in userData && userData.checks.indexOf(checkId)!=-1){
                        callback(true,cd);
                    }else{
                        callback(false);
                    }
                });
            }else{
                callback(false);
            }
        });
    } else {
        callback(false);
    }
};

module.exports = handler;