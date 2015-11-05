var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var Article = require('../models/article.js');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
     var page = req.query.p?parseInt(req.query.p):1;
     var username = req.session.user?req.session.user.name:null;
     Article.findAll(username,page,function(err,articles,total){
     if(err){
        articles = [];
     }
     res.render('index', {
     title: '主页',
     articles:articles,
     page:page,
     isFirstPage:(page-1)==0,
     isLastPage:((page-1)*10+articles.length) == total,
     error:req.flash('error').toString(),
     success:req.flash('success').toString()
     });
     });

   /* res.render('index', {
        title: '主页'});*/

});


router.get('/reg',function(req,res){
	res.render('register',{title:'注册'});
})

router.post('/reg',function(req,res){
	if (req.body['PassWord']!=req.body['Repeat-pwd']) {
		req.flash('error','密码输入不一致，请重新输入')
		//res.sender('');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5');
	var PassWord = md5.update(req.body.PassWord).digest('base64');
	var newUser = new User({
		name:req.body.UserName,
		password:PassWord
	});

	User.get(newUser.name,function(err,user){
		if (user) {
			err='Username is already exists';
		}
		if(err){
			req.flash('error',err);
			return res.redirect('/reg');
		}
		newUser.save(function(err){
			if (err) {
				req.flash('error',err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success','注册成功');
			res.redirect('/');
		})
	})
})

router.get('/login',function(req,res){
	res.render('login',{title:'登录'})
})

router.post('/login',function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.PassWord).digest('base64');
	User.get(req.body.UserName,function(err,user){
		if (!user) {
			req.flash('error','用户不存在');
			return res.redirect('/login');
		}

		if (user.password !=password) {
			req.flash('error','用户口令错误');
			return res.redirect('/login');
		}

		req.session.user = user;
		req.flash('success','登录成功');
		res.redirect('/');
	});
});

router.get('/logout',function(req,res){
	req.session.user = null;
	req.flash('success','登出成功');
	res.redirect('/');
})

router.get('/article',function(req,res){
    res.render('article',{
        title:'发布blog',
        data:req.session.user
    });
});

router.post('/article',function(req,res){
    var newArticle = new Article({
         title: req.body.title,
        content:req.body.content,
        createtime :req.body.createtime,
        createuser:req.session.user.name
    });

   newArticle.save(function(err){
    if(err){
        req.flash('error',err);
        return res.redirect('/');
    }
     req.flash('success','添加成功');
     res.redirect('/');
   });
})

router.get('/update/:title',function(req,res){
       Article.get(req.params.title,function(err,article){
           if(err){
               req.flash('error',err);
               return res.redirect('/');
           }

           res.render('udpate',{
               title:'修改详情页',
               article:article,
               error:req.flash('error').toString(),
               success:'读取成功'
           });
       });
})


router.post('/update',function(req,res){
    Article.Update(req.body.title,req.body.content,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/update/'+req.body.id+'');
        }
        req.flash('success','修改成功');
        res.redirect('/');
    })
})

router.get('/delete/:tit',function(req,res){
    Article.Romove(req.params.tit,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }

        req.flash('success','删除成功');
        res.redirect('/');
    })
})


module.exports = router;
