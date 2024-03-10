//dependencies

//scaffolding
const handler = {};

//making handler while hit at /sample/

handler.notFoundHandler = (requestProperty,callback)=>{
    console.log(requestProperty);
    callback(404, {
        'message':'404 not found',
    })
};

module.exports = handler;