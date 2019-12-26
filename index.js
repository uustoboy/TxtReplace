const fs = require('fs');
const path = require("path");
const log4js = require("log4js");
const resolve = path.resolve;
const join = path.join;
const extname = path.extname;
// log4js setting
const logger = log4js.getLogger();
logger.level = 'debug';

// input your path
// const inputPath = "/Users/uustoboy/web/git/TxtReplace/";
// const inputPath = "E:/cece2/c/index1.css";
// const inputPath = "E:/cece2";
const inputPath = [
    "E:/cece2/c/index1.css",
    "E:/cece2/c/index2.css",
    "E:/cece2/c/index3.css"
];
// const filePath = resolve(inputPath);

//限定文件后缀;
let suffix= ['.css'];

//全局替换文本;
let textReplace={
    text: 'http://',
    replace: '//'
}


// 执行方法;
// fileDisplayPath(filePath);

/**
 * 文件遍历
 * @param fileDisplayPath
 */
// function fileDisplayPath(filePath) {
//     fs.readdir(filePath, (err, files) => {
//         if (err) {
//             logger.debug(err)
//         } else {
//             files.forEach((filename) => {
//                 // 获取绝对路径
//                 let filedir = path.join(filePath, filename)

//                 fs.stat(filedir, (error, stats) => {
//                     if (error) {
//                         logger.debug(error)
//                     } else {
//                         // 文件夹、文件的不同处理
//                         let isFile = stats.isFile()
//                         let isDir = stats.isDirectory()

//                         if (isFile && suffix.includes(extname(filedir))) {
//                             let content = fs.readFileSync(filedir, "utf-8");
//                             let strNew = content.replace(textReplace.text, textReplace.replace);
//                             fs.writeFile(filedir, strNew, "utf8", err => {
//                               if (err) throw err;
//                               logger.info("success done");
//                               let fileTxt = __dirname +'TxtReplace.txt';
//                                 if (isFileExisted(fileTxt)){

//                                 }else{
//                                     let txt = filedir +'\n';
//                                     fs.writeFile(
//                                       fileTxt,
//                                         txt,
//                                       function(err) {
//                                         if (err) {
//                                           return console.log(err);
//                                         }
//                                         console.log("The file was saved!");
//                                       }
//                                     );
//                                 }

//                                 // let content = fs.readFileSync(filedir, "utf-8");
//                                 // fs.writeFile(,'');
//                             });
//                         }

//                         if (isDir) {
//                             // 递归
//                             fileDisplayPath(filedir)
//                         }
//                     }
//                 })
//             })
//         }
//     })
// }

const filterFile = (parameter)=>{
    if( getType(parameter) =='Array' ){
        parameter.forEach((value, index, array)=>{
            filterFile(value);
        });
    }else if(getType(parameter) =='String'){
        let  statType = isFileExisted(parameter);
        if( statType == '0' && suffix.includes(extname(parameter)) ){
            let content = readFile(parameter);                     
            let strNew = content.replaceAll(textReplace.text, textReplace.replace);
            // console.log(strNew)
             if(strNew.toString()!==content.toString()){
                writeFile(parameter,strNew,'更改成功！');
             }
            
        }else if(statType=='1'){
            fileDisplayPath(parameter).then(files => {
                files.forEach((filename) => {
                    // 获取绝对路径
                    let filedir = join(parameter, filename)
                    // console.log(filedir)
                    fs.stat(filedir, (error, stats) => {
                        if (error) {
                            logger.debug(error);
                        } else {
                            // 文件夹、文件的不同处理
                            let isFile = stats.isFile();
                            let isDir = stats.isDirectory();
                            if (isFile && suffix.includes(extname(filedir))) {
                                let content = readFile(filedir);
                                let strNew = content.replace(textReplace.text, textReplace.replace);
                                if(strNew !== content){
                                    writeFile(parameter,strNew,'更改成功！');
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
    let content =  fs.readFileSync(filedir, "utf-8");
    return content;
}

//写入日志;
const writeLog = (filedir) =>{
    let fileTxt = join(__dirname,'TxtReplace.txt');
    if( isFileIn(fileTxt) ){
        let content = readFile(fileTxt);
        let strNew = content+`${filedir} \n`;
        writeFile(fileTxt,strNew,'写入日志~',false);
    }else{
        let txt = filedir +'\n';
        writeFile(fileTxt,txt,'写入日志~',false);
    }
}

//更改文件;
const writeFile = (parameter,strNew,title,judgeLog=true) =>{
    fs.writeFile(parameter, strNew, "utf8", err => {
        if (err)  logger.debug(err);
        logger.info(`${parameter} ${title}`);
        if(judgeLog){
            writeLog(parameter);
        }
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

filterFile(inputPath)
