//dependencies
const fs = require('node:fs');
const path = require('node:path');
//scaffolding
const lib = {};
//base directory
lib.baseDir = path.join(__dirname, '../.data/');
//function to create a file 
lib.create = (dir, filename, data, callback)=>{
    fs.open(`${lib.baseDir+dir}/${filename}.json`,'wx',(err,fd)=>{
        if(!err && fd){
            const dataToString = JSON.stringify(data);
            fs.writeFile(fd,dataToString,(err1)=>{
                if(!err1){
                    fs.close(fd,(err2)=>{
                        if(!err2){
                            callback('file created successfull');
                        }else{
                            callback(err2);
                        }
                    });
                }else{
                    callback(err1);
                }
            });
        }else{
            callback(err);
        }
    });
};
//function to read file
lib.read = (dir, filename, callback)=>{
    fs.readFile(`${lib.baseDir+dir}/${filename}.json`,'utf-8',(err,data)=>{
        callback(err,data);
    });
};

module.exports = lib;