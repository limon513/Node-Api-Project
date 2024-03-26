//dependencies
const {sampleHandler} = require('./Handlers/RouteHandlers/sampleHandler');
const {userHandler} = require('./Handlers/RouteHandlers/userHandler');
const {tokenHandler} = require('./Handlers/RouteHandlers/tokenHandler');
const {checkHandler} = require('./Handlers/RouteHandlers/checkHandler');

//routes object
const routes = {
    sample: sampleHandler,
    user : userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;