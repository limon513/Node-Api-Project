//dependencies
const http = require('node:http');
const url = require('node:url');
const {handleReqRes} = require('./Helpers/handleReqRes');
const environment = require('./Helpers/enviornment');
const data = require('./Lib/data');
//app scafolding
const app = {};

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