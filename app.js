const client = require('./aipOcrClient')
var fs = require('fs');
const urlModule = require('url')
const https = require('https')
const qs = require('querystring')
var formidable = require('formidable');
let path = require('path');

const previteCrt = fs.readFileSync(path.join(__dirname, './https/7350095_www.gdyg5.top.pem'))
const previteKey = fs.readFileSync(path.join(__dirname, './https/7350095_www.gdyg5.top.key'))

const HTTPS_OPTIONS = {
    key: previteKey,
    cert: previteCrt
}

const getBase64 = (req, callback) => {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = './assets';
    form.parse(req,function(err,fields,files){
        fs.readFile(files.file.filepath, (err, data) => {
            callback(data.toString('base64'))
        })
    })
}

const app =  https.createServer(HTTPS_OPTIONS, function (req, res) {
    const url = req.url
    const method = req.method
    let query = urlModule.parse(url).query
    query = qs.parse(query)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    
    if (method === 'GET') {
        // res.setHeader("Content-Type", "application/json;charset=utf-8");
        res.writeHead(200,{
            "Content-Type": "application/json;charset=utf-8"
        });
        if (/\/api\/v1\/ocr/.test(url)) {
            client.generalBasicUrl(query.url).then(function(result) {
                res.end(JSON.stringify(result))
            }).catch(function(err) {
                res.end(JSON.stringify(err))
            });
        } else {
            emitError(res)
        }
    } else {
        if (url === '/api/v2/ocr') {
            res.writeHead(200, {"Content-Type": "multipart/form-data;charset=utf-8"})
            // 调用通用文字识别（高精度版）
            getBase64(req, base64 => {
                client.accurateBasic(base64).then(function(result) {
                    res.end(JSON.stringify(result))
                }).catch(function(err) {
                    // 如果发生网络错误
                    res.end(JSON.stringify(err))
                });
            })
            // let buffer = Buffer.alloc(0)
            // req.on('data', (data) => {
            //     buffer += data
            // })
            // req.on('end', () => {
            //     // const URL = JSON.parse(buffer.toString())
            // })
        } else {
            emitError(res)
        }
    }
})

function emitError(res) {  
    const data = {
        msg: '请求路径错误!',
        status: false,
    }
    res.statusCode = 404
    res.end(JSON.stringify(data))
}

app.listen(3000, () => {
    console.log('listening on 3000');
})
    
// // 调用通用文字识别, 图片参数为本地图片
// client.generalBasic(image).then(function(result) {
//     console.log(JSON.stringify(result));
// }).catch(function(err) {
//     // 如果发生网络错误
//     console.log(err);
// });