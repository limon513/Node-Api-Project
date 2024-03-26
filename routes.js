//dependencies
const {sampleHandler} = require('./Handlers/RouteHandlers/sampleHandler');
const {userHandler} = require('./Handlers/RouteHandlers/userHandler');
const {tokenHandler} = require('./Handlers/RouteHandlers/tokenHandler');


//routes object
const routes = {
    sample: sampleHandler,
    user : userHandler,
    token: tokenHandler,
};

module.exports = routes;