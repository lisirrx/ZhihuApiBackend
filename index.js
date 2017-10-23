const j2x = require('json2xml')
const http = require('http');
const Router = require('router')
const finalhandler = require('finalhandler')
const DOMParser = require('xmldom').DOMParser
const XMLSerializer = require('xmldom').XMLSerializer
const hostname= '0.0.0.0';
const port = 3001;
const zhihu = require('zhihu')
let topicID = '19550901';

var router = Router();




let topicAPI = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    zhihu.Topic.getTopicTopAnswersByID(topicID).then(function(result){
        let question_list =  result.questions;
        result.questions = new Array();
        
        for(let x in question_list){
            result.questions.push({'question' : question_list[x]})
        }

        data = {data:result};
        data = j2x(data)

        let dom = new DOMParser().parseFromString(data,'text/xml');
        dom.getElementsByTagName('data')[0].setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        dom.getElementsByTagName('data')[0].setAttribute('xsi:noNamespaceSchemaLocation','https://github.com/lisirrx/ZhihuApiBackend/raw/master/data.xsd');
        res.end(new XMLSerializer().serializeToString(dom));
    });
};



router.get('/topic', topicAPI);

const server = http.createServer((req, res)=>{
   
    router(req, res, finalhandler(req, res));
   
});


server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`)
});



