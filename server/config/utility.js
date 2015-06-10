exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      // res.redirect('/');
      res.status(200).send(newUser);
    });
};

exports.isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

exports.checkUser = function(req, res, next) {
  // console.log("checking user", req.session);
  if (!exports.isLoggedIn(req)){
    res.status(401).send({loggedIn: false});
  } else {
    next();
  }
};

exports.sendLoggedInStatus = function(req, res) {
  res.status(200).send({loggedIn: true});
};

exports.logout = function(req, res) {
  req.session.destroy(function(){
      res.status(200).send({loggedIn: false});
    });
};

//takes an array of recipe matches from yummly
//returns an array of recipe ids, necessary for relational bookshelf association
exports.parseRecipeIds = function(recipes){
  var recipeIds = [];
  for (var i = 0; i < recipes.length; i++) {
    recipeIds.push(recipes[i].id);
  }
  return recipeIds;
}

//returns a single array of recipe ids
exports.getObjectRecipeIds = function(obj){
  var results = [];
  for(var key in obj){
    //if file changes be mindful of this dependency on parseRecipeIds
    var temp = exports.parseRecipeIds(obj[key]);
    results = results.concat(temp);
  }
  return results
}

