//dependencies
const fileWork = require('../../Lib/data');
const utilities = require('../../Helpers/utilities');
const tokenHandler = require('./tokenHandler');
//scaffolding
const handler = {};
//making user handler
handler.userHandler = (requestProperty,callback)=>{
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperty.method)!=-1){
        handler._user[requestProperty.method](requestProperty,callback);
    }else{
        callback(405);
    }
};

//another scaffolding
handler._user = {};
//defining methods for request types
handler._user.post = (requestProperty,callback)=>{
    //user credentials validation
    const firstName = typeof(requestProperty.body.firstName)==='string' && 
                        requestProperty.body.firstName.trim().length > 0 ?
                        requestProperty.body.firstName : false;
    
    const lastName = typeof(requestProperty.body.lastName)==='string' &&
                        requestProperty.body.lastName.trim().length > 0 ?
                        requestProperty.body.lastName : false;
    
    const phone = typeof(requestProperty.body.phone)==='string' &&
                    requestProperty.body.phone.trim().length === 11 ?
                    requestProperty.body.phone : false;
    
    const password = typeof(requestProperty.body.password)==='string' &&
                        requestProperty.body.password.trim().length > 0 ?
                        requestProperty.body.password : false;

    const tosagreement = typeof(requestProperty.body.tosagreement)==='boolean' ?
                            requestProperty.body.tosagreement : false;
    //checking to the users folder if user already exists or not
    if(firstName && lastName && phone && password && tosagreement){ // if all valid
        fileWork.read('users',phone,(err1,userData)=>{
            if(err1){
                //create a user object
                const userData = {
                    firstName:firstName,
                    lastName:lastName,
                    phone:phone,
                    password:utilities.hashString(password),
                    tosagreement:tosagreement,
                };
                fileWork.create('users',phone,userData,(err2)=>{
                    if(err2){
                        callback(500,{
                            error:'something went wrong',
                        });
                    }else{
                        callback(200,{
                            message:'user created successfully',
                        });
                    }
                });
            }else{
                callback(500,{
                    error:"user already exists",
                });
            }
        });
    }
    else{
        callback(400,{
            error:"invalid credentials",
        });
    }
    
};

handler._user.get = (requestProperty,callback)=>{
    const urlParams = new URLSearchParams(requestProperty.queryStringObj);
    let phone = urlParams.get('phone').trim();
    phone = typeof(phone)==='string' && phone.length === 11
            ? phone : false;
    if(phone){
        tokenHandler._token.tokenMatch(phone,requestProperty.headersObj.token,(match)=>{
            if(match){
                fileWork.read('users',phone,(err1,d)=>{
                    const userData = { ...utilities.validJSON(d)};
                    if(!err1 && userData){
                        delete userData.password;
                        callback(200,userData);
                    }else{
                        callback(404,{
                            error:'user not found!',
                        });
                    }
                });
            }
            else{
                callback(403, {error:"please login first!"});
            }
        });
    }else{
        callback(404,{
            error: "invalid phone number",
        });
    }

};

handler._user.put = (requestProperty,callback)=>{
    const phone = typeof(requestProperty.body.phone)==='string' &&
                    requestProperty.body.phone.trim().length === 11 ?
                    requestProperty.body.phone : false;
    
    const firstName = typeof(requestProperty.body.firstName)==='string' && 
                    requestProperty.body.firstName.trim().length > 0 ?
                    requestProperty.body.firstName : false;

    const lastName = typeof(requestProperty.body.lastName)==='string' &&
                    requestProperty.body.lastName.trim().length > 0 ?
                    requestProperty.body.lastName : false;

    const password = typeof(requestProperty.body.password)==='string' &&
                        requestProperty.body.password.trim().length > 0 ?
                        requestProperty.body.password : false;
    if(phone){
        tokenHandler._token.tokenMatch(phone,requestProperty.headersObj.token,(match)=>{
            if(match){
                fileWork.read('users',phone,(err1,d)=>{
                    if(!err1 && d){
                        const userData = {...utilities.validJSON(d)};
                        if(firstName)   userData.firstName = firstName;
                        if(lastName)    userData.lastName = lastName;
                        if(password)    userData.password = utilities.hashString(password);
                        //update to the file
                        fileWork.update('users',phone,userData,(err2)=>{
                            if(!err2) callback(200,{
                                message: "User updated successfully",
                            });
                            else callback(500,{
                                error:"something went wrong",
                            });
                        });
                    }else{
                        callback(400,{
                            error:'user not found!',
                        });
                    }
                });
            }
            else{
                callback(403, {error:"please login first!"});
            }
        });
    }else{
        callback(400,{
            error:'invalid phone number',
        });
    }
};

handler._user.delete = (requestProperty,callback)=>{
    const urlParams = new URLSearchParams(requestProperty.queryStringObj);
    let phone = urlParams.get('phone').trim();
    phone = typeof(phone)==='string' && phone.length === 11
            ? phone : false;
    if(phone){
        tokenHandler._token.tokenMatch(phone,requestProperty.headersObj.token,(match)=>{
            if(match){
                fileWork.read('users',phone,(err1,d)=>{
                    const userData = { ...utilities.validJSON(d)};
                    if(!err1 && userData){
                        fileWork.delete('users',phone,(err2)=>{
                            if(!err2){
                                fileWork.delete('tokens',requestProperty.headersObj.token);
                                callback(200,{message:"user delete Successfull!",});
                            }else{
                                callback(500,{message:"something went wrong",});
                            }
                        });
                    }else{
                        callback(404,{
                            error:'user not found!',
                        });
                    }
                });
            }
            else{
                callback(403, {error:"please login first!"});
            }
        });
    }else{
        callback(404,{
            error: "invalid phone number",
        });
    }
};


module.exports = handler;