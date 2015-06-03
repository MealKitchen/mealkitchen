exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      // res.redirect('/');
      res.status(200).send(newUser);
    });
};

exports.isLoggedIn = function(req) {
  console.log("is logged in?", req.session);
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
