//dependencies

//scaffolding
const environment = {};

environment.staging = {
    port:3000,
    baseUrl:`http://localhost:${""+3000}`,
    envName: 'staging',
    secretKey: 'staging',
    timeoutLimit : 5,
    tokenLength : 30,
    checkIdLength : 20,
    maxcheckLength : 5,
    twilio:{
        accountSid:'AC70af61024d40a2c1451034b828793b1f',
        authToken:'0813aa8ac776949d24c40a31c14c4bb0',
        from:'+12567332246',
    },
};

environment.production = {
    port:5000,
    baseUrl:`http://localhost:${""+5000}`,
    envName: 'production',
    secretKey: 'production',
    timeoutLimit : 5,
    tokenLength : 30,
    checkIdLength : 20,
    maxcheckLength : 5,
    twilio:{
        accountSid:'AC70af61024d40a2c1451034b828793b1f',
        authToken:'0813aa8ac776949d24c40a31c14c4bb0',
        from:'+12567332246',
    },
};

const selectedEnvironment = typeof(process.env.NODE_ENV)==='string'?
                            process.env.NODE_ENV:
                            'staging';
module.exports = typeof(environment[selectedEnvironment])==='object'?
                environment[selectedEnvironment]:
                environment.staging;