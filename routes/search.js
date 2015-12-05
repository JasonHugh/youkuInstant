var express = require('express');

var url = require('url'); //解析操作url
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var router = express.Router();

/* GET home page. */
router.get('/search', function(req, res, next) {
   var searchContent = req.query.searchContent
   var page = req.query.page
   var targetUrl = encodeURI('http://www.soku.com/search_video/q_'+searchContent+'_orderby_1_limitdate_0?site=14&page='+page,"UTF-8");
   console.log(targetUrl)
   var data = {}
   var videos = []
   superagent.get(targetUrl)
      .end(function (err, res) {
         //console.log(res);
         var $ = cheerio.load(res.text);
         $('.sk-vlist .v').each(function (i, element) {
            var img = $(element).children('.v-thumb').children('img').attr('src');
            var time = $(element).children('.v-thumb').children('.v-thumb-tagrb').children('.v-time').text();
            var a = $(element).children('.v-link').children('a').attr('href');
            var title = $(element).children('.v-link').children('a').attr('title');
            videos[i] = {img:img,time:time,a:a,title:title};
            
         });

         data['videos'] = videos
         data['prev'] = $('.sk_pager ul .prev a').attr('href')
         data['now'] = $('.sk_pager ul .current span').text()
         data['next'] = $('.sk_pager ul .next a').attr('href')
         var pages = []
         $('.sk_pager ul li a').each(function(i,v){
            var num = $(v).text()
            if(num != '上一页' && num != '下一页'){
               pages[i] = num
            }
         })
         if(pages[0] == null)
            pages.splice(0,1)
         data['pages'] = pages
      });
   setTimeout(function(){
      console.log(data['pages']);
      res.send( JSON.stringify(data) );
   },1500);
   
});

module.exports = router;
