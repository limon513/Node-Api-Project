//dependecies
const url = require('node:url');
const {StringDecoder} = require('node:string_decoder');
const routes = require('../routes');
const {notFoundHandler} = require('../Handlers/RouteHandlers/notFoundHandler');
const environment = require('./enviornment');

//scaffolding
const handle = {};

//request handling function
handle.handleReqRes = (req,res)=>{
    //parsing the url from a urlstring to obj
    const parsedUrl = new URL(environment.baseUrl+req.url);
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');
    //make a request property object to pass through choosenHandler
    const requestProperty = {
        path:parsedUrl.pathname,
        trimmedPath,
        parsedUrl,
        method:req.method.toLowerCase(),
        queryStringObj:parsedUrl.search,
        headersObj:req.headers,
    };
    //choose appropiate handler through routes path
    const choosenHandler = routes[trimmedPath]?routes[trimmedPath]:notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let reqBody = '';
    req.on('data',(buffer)=>{
        reqBody += decoder.write(buffer);
    });
    req.on('end',()=>{
        reqBody += decoder.end();
        choosenHandler(requestProperty,(statusCode,payload)=>{
            //checking for the status code and the payload
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? JSON.stringify(payload) : {};
            //sending response
            res.writeHead(statusCode);
            res.end(payload);
        });
        console.log(reqBody);
    });
};

module.exports = handle;