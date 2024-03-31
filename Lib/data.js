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
                            callback(false);
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

//function to overrite file
lib.update = (dir, filename, data, callback)=>{
    //open the file
    fs.open(`${lib.baseDir+dir}/${filename}.json`,'r+',(err1,fd)=>{
        if(!err1 && fd){
            fs.truncate(`${lib.baseDir+dir}/${filename}.json`,(err2)=>{
                if(!err2){
                    fs.writeFile(fd,JSON.stringify(data),(err3)=>{
                        if(!err3){
                            fs.close(fd,(err4)=>{
                                if(err4)callback(err4);
                                else callback(false);
                            });
                        }else{
                            callback(err3);
                        }
                    });
                }else{
                    callback(err2);
                }
            });
        }else{
            callback(err1);
        }
    });
};

//function to delete file
lib.delete = (dir, filename, callback)=>{
    fs.unlink(`${lib.baseDir+dir}/${filename}.json`,(err)=>{
        if(err) callback(false);
        else callback(true);
    });
};

module.exports = lib;