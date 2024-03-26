//dependencies
const fileWork = require('../../Lib/data');
const utilities = require('../../Helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {timeoutLimit,tokenLength,checkIdLength,maxcheckLength} = require('../../Helpers/enviornment');
//scaffolding
const handler = {};
//making user handler
handler.checkHandler = (requestProperty,callback)=>{
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperty.method)!=-1){
        handler._check[requestProperty.method](requestProperty,callback);
    }else{
        callback(405);
    }
};

//another scaffolding
handler._check = {};
//defining methods for request types
handler._check.post = (requestProperty,callback)=>{
    const protocol = typeof(requestProperty.body.protocol)==='string' &&
                    ['http','https'].indexOf(requestProperty.body.protocol.trim()) != -1 ?
                    requestProperty.body.protocol.trim() : false;

    const url = typeof(requestProperty.body.url)==='string' &&
                    requestProperty.body.url.trim().length > 0 ?
                    requestProperty.body.url.trim() : false;
    
    const method = typeof(requestProperty.body.method)==='string' &&
                    ['get','post','put','delete'].indexOf(requestProperty.body.method.trim().toLowerCase()) != -1 ?
                    requestProperty.body.method.trim().toLowerCase() : false;
                
    const successcode = typeof(requestProperty.body.successcode)==='object' &&
                        requestProperty.body.successcode instanceof Array ?
                        requestProperty.body.successcode : false;

    const timeout = typeof(requestProperty.body.timeout) === 'number' && 
                    Math.floor(requestProperty.body.timeout) <= timeoutLimit ?
                    requestProperty.body.timeout : false;

    if(protocol && url && method && successcode && timeout){
        const checkObj = {
            id : utilities.generateToken(checkIdLength),
            protocol,
            url,
            method,
            successcode,
            timeout,
        };
        const token = typeof(requestProperty.headersObj.token)==='string' && 
                        requestProperty.headersObj.token.trim().length === tokenLength ?
                        requestProperty.headersObj.token.trim() : false;

        if(token){
            fileWork.read('tokens',token,(err1,td)=>{
                const tokenObj = utilities.validJSON(td);
                if(!err1 && tokenObj && tokenObj.expires>Date.now()){
                    fileWork.read('users',tokenObj.phone,(err2,ud)=>{
                        const userData = {... utilities.validJSON(ud)};
                        if(!err2 && userData){
                            const userChecks = typeof(userData.checks)==='object' &&
                                            userData.checks instanceof Array ?
                                            userData.checks : [];
                            if(userChecks.length < maxcheckLength){
                                fileWork.create('checks',checkObj.id,checkObj,(err3)=>{
                                    if(!err3){
                                        userData.checks = userChecks;
                                        userData.checks.push(checkObj.id);
                                        fileWork.update('users',userData.phone,userData,(err4)=>{
                                            if(!err4){
                                                callback(200,{
                                                    message:"check added!", 
                                                    checkObj,
                                                });
                                            }else{
                                                callback(500,{error:"SWR!"});
                                            }
                                        });
                                    }else{
                                        callback(500,{error:"something went wrong creating checks"});
                                    }
                                });
                            }else{
                                callback(400,{error:"max check limit reached!"});
                            }
                        }else{
                            callback(500,{error:"something went wrong user not found!"});
                        }
                    });
                }else{
                    callback(403,{error:"authentication failed! or session expired!"});
                }
            });
        }else{
            callback(403,{error:"authentication failed!"});
        }
    }else{
        callback(400,{error:'critaria not matching for checking!'});
    }
};

handler._check.get = (requestProperty,callback)=>{
    

};

handler._check.put = (requestProperty,callback)=>{
    
};

handler._check.delete = (requestProperty,callback)=>{
    
};


module.exports = handler;