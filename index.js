const fs = require('fs');
const path = require("path");
const log4js = require("log4js");
const resolve = path.resolve;
const extname = path.extname;
// log4js setting
const logger = log4js.getLogger();
logger.level = 'debug';

// input your path
const inputPath = "/Users/uustoboy/web/git/TxtReplace/";
const filePath = resolve(inputPath);
// logger.debug(filePath);
let suffix= ['.css'];
let textReplace=['http://','//'];


// 执行方法;
fileDisplayPath(filePath);

/**
 * 文件遍历
 * @param fileDisplayPath
 */
function fileDisplayPath(filePath) {
    fs.readdir(filePath, (err, files) => {
        if (err) {
            logger.debug(err)
        } else {
            files.forEach((filename) => {
                // 获取绝对路径
                let filedir = path.join(filePath, filename)

                fs.stat(filedir, (error, stats) => {
                    if (error) {
                        logger.debug(error)
                    } else {
                        // 文件夹、文件的不同处理
                        let isFile = stats.isFile()
                        let isDir = stats.isDirectory()

                        if (isFile && suffix.includes(extname(filedir))) {
                            let content = fs.readFileSync(filedir, "utf-8");
                            let strNew = content.replace(textReplace[0], textReplace[1]);
                            fs.writeFile(filedir, strNew, "utf8", err => {
                              if (err) throw err;
                              logger.info("success done");
                              let fileTxt = __dirname +'TxtReplace.txt';
                                if (isFileExisted(fileTxt)){

                                }else{
                                    let txt = filedir +'\n';
                                    fs.writeFile(
                                      fileTxt,
                                        txt,
                                      function(err) {
                                        if (err) {
                                          return console.log(err);
                                        }
                                        console.log("The file was saved!");
                                      }
                                    );
                                }

                                // let content = fs.readFileSync(filedir, "utf-8");
                                // fs.writeFile(,'');
                            });
                        }

                        if (isDir) {
                            // 递归
                            fileDisplayPath(filedir)
                        }
                    }
                })
            })
        }
    })
}


//判断文件是否存在;
const isFileExisted = file=>{
    fs.access(file,err=>{
        if (err) {
            return false;
        } else {
            return true;
        }
    });
};
