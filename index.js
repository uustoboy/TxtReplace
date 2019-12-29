const fs = require('fs');
const path = require("path");
const log4js = require("log4js");
const resolve = path.resolve;
const join = path.join;
const extname = path.extname;
// log4js setting
const logger = log4js.getLogger();
logger.level = 'debug';

//文件路径(可字符串，可数组):支持文件夹;
let inputPath = [
  "/Users/uustoboy/web/git/TxtReplace/public.css",
  "/Users/uustoboy/web/git/TxtReplace/public1.css",
  "/Users/uustoboy/web/git/TxtReplace/public2.css",
  "/Users/uustoboy/web/git/TxtReplace/aa/"
];

//let inputPath = "/Users/uustoboy/web/git/TxtReplace/public2.css";

//限定文件后缀;
let suffix = ['.css','.js'];

//全局替换文本;
let textReplace = {
    'http://': '//',
    'background': 'bg'
};

//替换文件;
const filterFile = (parameter)=>{
    if( getType(parameter) =='Array' ){
        parameter.forEach((value, index, array)=>{
            filterFile(value);
        });
    }else if(getType(parameter) =='String'){
        let  statType = isFileExisted(parameter);
        if( statType == '0' && suffix.includes(extname(parameter)) ){
            let content = readFile(parameter);
            let keyArr = [];
            for (var key in textReplace) {
                keyArr.push(key);
            }
            reg = new RegExp(keyArr.join("|"), "g");
            let strNew = content.replace(reg, function(matchStr) {
              return textReplace[matchStr];
            });

             if(strNew.toString()!==content.toString()){
                writeLog(parameter);
                writeFile(parameter,strNew,'更改成功！');
             }
        }else if(statType=='1'){
            fileDisplayPath(parameter).then(files => {
                files.forEach((filename) => {
                    // 获取绝对路径
                    let filedir = join(parameter, filename);
                    fs.stat(filedir, (error, stats) => {
                      if (error) {
                        logger.debug(error);
                      } else {
                        // 文件夹、文件的不同处理
                        let isFile = stats.isFile();
                        let isDir = stats.isDirectory();
                        if (isFile && suffix.includes(extname(filedir))) {
                            let content = readFile(filedir);
                            let keyArr = [];
                            for (var key in textReplace) {
                                keyArr.push(key);
                            }
                            reg = new RegExp(keyArr.join("|"), "g");
                            let strNew = content.replace(reg, function(matchStr) {
                                return textReplace[matchStr];
                            });
                            if (strNew.toString() !== content.toString()) {
                                writeLog(filedir);
                                writeFile(filedir, strNew, "更改成功！");
                            }
                        }
                        if (isDir) {
                          // 递归
                          filterFile(filedir);
                        }
                      }
                    });
                });
            })
        }
    }
}

//读取文件;
const  readFile =  (filedir)=>{
    let content = fs.readFileSync(filedir, "utf-8");
    return content;
}

//更改文件;
const writeFile = (parameter,strNew,title) =>{
    fs.writeFile(parameter, strNew, "utf8", err => {
      if (err) logger.debug(err);
        logger.debug(`${parameter} ${title}`);
    });
}

//写入日志;
const writeLog = (filedirArr) => {
    let fileTxt = join(__dirname, 'TxtReplace.txt');
    let content = isFileIn(fileTxt) ? readFile(fileTxt) : '';
    let txt = content + "\n" + filedirArr ;
    logger.info(`${filedirArr} 写入日志`);
    fs.writeFileSync(fileTxt, txt, "utf8", err => {
        if (err) logger.debug(err);
        logger.info(`${fileTxt} 写入日志`);
    });
}

//目录;
const fileDisplayPath = (filePath)=>{
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, (err, files) => {
            if(err){
                return  reject(err);
            }else{
                return  resolve(files);
            }
        });
    });
}

//判断数组,字符串;
const getType = (parameter)=>{
    if(Array.isArray(parameter)){
        return 'Array';
    }
    if((typeof parameter=='string')&&parameter.constructor==String){
        return 'String';
    }
    return false;
}

//判断文件是否存在;
const isFileExisted = file=>{
    let statType = null;
    if(fs.statSync(file).isDirectory()){ //文件夹
        statType='1';
        return statType;
    }
    if(fs.statSync(file).isFile()){  //文件
        statType='0';
        return  statType;
    }
};

//判断文件/文件夹 是否存在;
const isFileIn = ( _path ) => fs.existsSync( _path )?true:false;

//replaceAll正则;
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

// 执行方法;
filterFile(inputPath);
