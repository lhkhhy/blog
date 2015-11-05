;
var db =require('./db')
var markdown = require('markdown').markdown;

function Article(article){
    this.title = article.title;
    this.content = article.content;
    this.createtime = article.createtime;
    this.createuser = article.createuser;
};

module.exports = Article;


Article.prototype.save = function  save(callback){
    var article = {
        title:this.title,
        content: this.content,
        createtime: this.createtime,
        createuser: this.createuser
    }

    db.open(function(err,mongodb){
        if(err){
            db.close();
            return   callback(err);
        }

        mongodb.collection('articles',function(err,collection){
            if(err){
                db.close();
                return    callback(err);
            }

            collection.insert(article,{safe:true},function(err,article){
                db.close();
                callback(err,article);
            });
        });
    });
}

Article.get = function get(tit,callback){

    db.open(function(err,mongodb){
        if(err){
            db.close();
            return callback(err);
        }

        mongodb.collection('articles',function(err,collection){
            if(err){
                db.close();
                return   callback(err);
            }

            collection.findOne({title:tit},function(err,doc){
                if(doc){
                    console.log(doc);
                    //var article = new Article(doc);
                    callback(err,doc);
                }else
                {
                    callback(err,null);
                }
            });
        });
    });
}


Article.findAll  = function  findAll(createuser,page, callback){
    db.open(function(err,mongodb){
        if(err){
            db.close();
            return   callback(err);
        }

        mongodb.collection('articles',function(err,collection){
            if(err){
                db.close();
               return  callback(err);
            }

            collection.count({createuser:createuser},function(err,total){
                collection.find({createuser:createuser},{
                    skip:(page-1)*10,
                    limit:10
                }).toArray(function(err,docs){
                        mongodb.close();
                        if(err){
                            return   callback(err);
                        }
                      /*  docs.forEach(function(doc){
                            doc.article = markdown.toHTML(doc.article);
                        })*/
                        callback(null,docs,total);
                    });
            });
        });
    });
}


Article.Update = function Update(tit,con,callback){

    db.open(function(err,mongodb){
        if(err){
            db.close();
            return callback(err);
        }

        mongodb.collection('articles',function(err,collection){
            if(err){
                db.close();
                return callback(err);
            }
            console.log(tit);
            console.log(con);
            collection.update({title:tit},{$set:{content:con}},function(err){
                   db.close();
                   if(err){
                       return callback(err);
                   }
                   callback(null);
            });
        });
    })
}


Article.Romove = function Romove(tit,callback){
    db.open(function(err,mongodb){
        if(err){
            db.close();
            return callback(err);
        }

        mongodb.collection('articles',function(err,collection){
            if(err){
                db.close();
                return callback(err);
            }

            collection.findOne({title:tit},function(err,doc){
                if(err){
                    return callback(err);
                }

                collection.remove(doc,{w:1},function(err){
                    db.close();
                    if(err){
                        callback(err);
                    }
                    callback(null);
                })

            })

        })
    })
}