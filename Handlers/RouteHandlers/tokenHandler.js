//dependencies
const fileWork = require('../../Lib/data');
const utilities = require('../../Helpers/utilities');
//scaffolding
const handler = {};
//making user handler
handler.tokenHandler = (requestProperty,callback)=>{
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperty.method)!=-1){
        handler._token[requestProperty.method](requestProperty,callback);
    }else{
        callback(405);
    }
};

//another scaffolding
handler._token = {};
//defining methods for request types
handler._token.post = (requestProperty,callback)=>{
    //user credentials validation
    const phone = typeof(requestProperty.body.phone)==='string' &&
                    requestProperty.body.phone.trim().length === 11 ?
                    requestProperty.body.phone : false;
    
    const password = typeof(requestProperty.body.password)==='string' &&
                        requestProperty.body.password.trim().length > 0 ?
                        requestProperty.body.password : false;
    if(phone && password){
        fileWork.read('users',phone,(err1,u)=>{
            if(!err1 && u){
                //check password is correct
                const hashPass = utilities.hashString(password);
                if(hashPass === utilities.validJSON(u).password){
                    const tokenObj = {
                        phone : phone,
                        tokenId : utilities.generateToken(),
                        expires : Date.now()+60*60*1000,
                    };
                    fileWork.create('tokens',tokenObj.tokenId,tokenObj,(err2)=>{
                        if(err2) callback(500,{message:"something went wrong!"});
                        else callback(200,tokenObj);
                    });
                }else{
                    callback(400,{error:"incorrect password",});
                }

            }else{
                callback(400,{error:"incorrect phone number",});
            }
        });
    }else{
        callback(400,{error:"invalid credentials",});
    }
};

handler._token.get = (requestProperty,callback)=>{
    const urlQObj = new URLSearchParams(requestProperty.queryStringObj);
    let tid = urlQObj.get('tid').trim();
    //token id validation
    tid = typeof(tid) === 'string' && tid.length === 30 ?
        tid : false;
    if(tid){
        fileWork.read('tokens',tid,(err1,td)=>{
            if(!err1 && td){
                const tokenObj = {...utilities.validJSON(td)};
                callback(200,tokenObj);
            }else{
                callback(400,{error:"notoken!!"});
            }
        });
    }else{
        callback(400,{error:"invalid token"});
    }
};

handler._token.put = (requestProperty,callback)=>{
    const tokenId = typeof(requestProperty.body.tokenId) === 'string' && 
                    requestProperty.body.tokenId.trim().length === 30 ?
                    requestProperty.body.tokenId.trim() : false;
    const toExtend = typeof(requestProperty.body.toExtend) === 'boolean'?
                    requestProperty.body.toExtend : false;
    if(tokenId && toExtend){
        fileWork.read('tokens',tokenId,(err1,t)=>{
            if(!err1 && t){
                let tokenObj = {...utilities.validJSON(t)};
                if(tokenObj.expires > Date.now()){
                    tokenObj.expires = tokenObj.expires + 60*60*1000;
                    fileWork.update('tokens',tokenObj.tokenId,tokenObj,(err2)=>{
                        if(err2) callback(500,{error:"something went wrong!"});
                        else callback(200,{message:"token extended"});
                    });
                }else{
                    callback(400,{message:"token already expired, login again!"});
                }
            }else{
                callback(400,{error:"invalid token.",});
            }
        });
    }else{ 
        callback(400,{error:"invalid request",});
    }
};

handler._token.delete = (requestProperty,callback)=>{
    const urlParams = new URLSearchParams(requestProperty.queryStringObj);
    let token = urlParams.get('tid').trim();
    token = typeof(token)==='string' && token.length === 30
            ? token : false;
    if(token){
        fileWork.read('tokens',token,(err1,td)=>{
            const tokenObj = { ...utilities.validJSON(td)};
            if(!err1 && tokenObj){
                fileWork.delete('tokens',token,(err2)=>{
                    if(!err2){
                        callback(200,{message:"token delete Successfull!",});
                    }else{
                        callback(500,{message:"something went wrong",});
                    }
                });
            }else{
                callback(404,{
                    error:'not found!',
                });
            }
        });
    }else{
        callback(404,{
            error: "invalid token number",
        });
    }
};

handler._token.tokenMatch = (phone,token,callback)=>{
    //validate token
    const validtoken = typeof(token)==='string' && token.trim().length===30 ?
                        token.trim() : false;
    if(validtoken){
        fileWork.read('tokens',validtoken,(err1,td)=>{
            if(!err1 && td){
                const tokenObj = {...utilities.validJSON(td)};
                if(phone===tokenObj.phone && tokenObj.expires>Date.now()){
                    callback(true);
                }else{
                    callback(false);
                }
            }else{
                callback(false);
            }
        });
    }else{
        callback(false);
    }
};


module.exports = handler;