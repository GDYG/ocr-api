var AipOcrClient = require("./aip-node-sdk-4.15.6/src/index").ocr;

// 设置APPID/AK/SK
var APP_ID = "25635714";
var API_KEY = "BFaQBtvzbQP53gtafijGbsTq";
var SECRET_KEY = "nyuwOCZnQo7ycoV2enxILH7uIkS75EDc";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

module.exports = client