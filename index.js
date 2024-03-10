//dependencies
const http = require('node:http');
const url = require('node:url');
const {handleReqRes} = require('./Helpers/handleReqRes');
const environment = require('./Helpers/enviornment');
const data = require('./Lib/data');
//app scafolding
const app = {};

//testing file creation
data.create('files','test',{'message':'creating test file','author':'pegasus'},(err)=>{
    if(err) console.log(err);
    else console.log('file created successfully');
});
//testing file read
data.read('files','test',(err,data)=>{
    console.log(err);
    console.log(data);
});
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