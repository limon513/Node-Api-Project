//dependencies
const server = require('./Lib/server');
const worker = require('./Lib/worker');
//app scafolding
const app = {};

//app initialisation
app.init = ()=>{
    //server initialization
    server.init();
    worker.init();
}

app.init();

module.exports = app;