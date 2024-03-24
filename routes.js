//dependencies
const {sampleHandler} = require('./Handlers/RouteHandlers/sampleHandler');
const {userHandler} = require('./Handlers/RouteHandlers/userHandler');
//routes object
const routes = {
    sample: sampleHandler,
    user : userHandler
};

module.exports = routes;