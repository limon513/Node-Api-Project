//dependencies

//scaffolding
const handler = {};

//making handler while hit at /sample/

handler.sampleHandler = (requestProperty, callback)=>{
    console.log(requestProperty);
    callback(200,{
        'message':'message from sample handler',
    })
};

module.exports = handler;