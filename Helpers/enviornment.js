//dependencies

//scaffolding
const environment = {};

environment.staging = {
    port:3000,
    baseUrl:`http://localhost:${""+3000}`,
    envName: 'staging',
    secretKey: 'staging',
};

environment.production = {
    port:5000,
    baseUrl:`http://localhost:${""+5000}`,
    envName: 'production',
    secretKey: 'production',
};

const selectedEnvironment = typeof(process.env.NODE_ENV)==='string'?
                            process.env.NODE_ENV:
                            'staging';
module.exports = typeof(environment[selectedEnvironment])==='object'?
                environment[selectedEnvironment]:
                environment.staging;