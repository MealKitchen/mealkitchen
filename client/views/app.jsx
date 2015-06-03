/** @jsx React.DOM */

//These variables are for the router at the bottom of the page.
var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

/////////////////////////////////////
///////// BACKBONE STORES ///////////
/////////////////////////////////////

var userSignUp = new UserModel();
var userLogIn = new UserModel();
var user = new UserModel();
var recipesCollection = new RecipesCollection();
var mealPlan = new MealPlanModel();
var mealPlans = new MealPlansCollection();
var queryModel = new QueryModel();

/////////////////////////////////////
//////////// WRAPPERS ///////////////
/////////////////////////////////////

var SignUpWrapper = React.createClass({
  render: function(){
    return(
      <SignUp user={userSignUp} />
    );
  }
});

var LogInWrapper = React.createClass({
  render: function(){
    return(
      <LogIn userLogIn={userLogIn} user={user} />
    );
  }
});

var MealQueryWrapper = React.createClass({
  render: function(){
    return(
      <MealQuery recipes={recipesCollection} query={queryModel} user={user} />
    );
  }
});

var ReviewMealsWrapper = React.createClass({
  render: function(){
    return(
      <ReviewMeals recipes={recipesCollection} query={queryModel} mealPlan={mealPlan} user={user} />
    );
  }
});

var ShoppingListWrapper = React.createClass({
  render: function(){
    return(
      <ShoppingList mealPlan={mealPlan} user={user} />
    );
  }
});

var MealPlansWrapper = React.createClass({
  render: function(){
    return(
      <MealPlans mealPlans={mealPlans} user={user} />
    );
  }
});

var MealPlanWrapper = React.createClass({
  render: function(){
    return(
      <MealPlan mealPlans={mealPlans} user={user} />
    );
  }
});

//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  mixins: [Navigation, Backbone.Events],

  getInitialState: function(){
    return {loggedIn: false};
  },
  
  render: function() {

    return (
      <div className="container-fluid">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand"><Link to="login">Meal Plan</Link></a>
              <button type="button" className="btn btn-default"><Link to="mealquery">Create Meal Plan</Link></button>
              <button type="button" className="btn btn-default"><Link to="mealplans">View Meal Plans</Link></button>
              <button type="button" className="btn btn-default"><Link to="login">Log Out</Link></button>
              <button type="button" className="btn btn-default"><Link to="login">Log In</Link></button>
            </div>

          </div>
        </nav>
<<<<<<< HEAD
        <header>
          <h1>Meal Plan</h1>
        </header>
=======

>>>>>>> more bootstrap updates
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route handler={AppView} path="/">
    <Route name="signup" handler={SignUpWrapper} />
    <Route name="login" handler={LogInWrapper} />
    <Route name="mealquery" handler={MealQueryWrapper} />
    <Route name="reviewmeals" handler={ReviewMealsWrapper} />
    <Route name="shoppinglist" handler={ShoppingListWrapper} />
    <Route name="mealplans" handler={MealPlansWrapper} />
    <DefaultRoute handler={LogInWrapper} />
  </Route>
);


Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler />, document.body);
});
