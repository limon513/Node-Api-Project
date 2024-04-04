//dependencies
const http = require('node:http');
const {handleReqRes} = require('../Helpers/handleReqRes');
const environment = require('../Helpers/enviornment');
//server scafolding
const server = {};



//creating server
server.createServer = () => {
    const createserver = http.createServer(server.handleRR);
    createserver.listen(environment.port, ()=>{
        console.log(`listening to port ${environment.port}`);
    });
};

//handling server request
server.handleRR = handleReqRes;

server.init = ()=>{
    server.createServer();
}

module.exports = server;