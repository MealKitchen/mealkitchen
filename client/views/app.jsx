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
      <LogIn user={userLogIn} />
    );
  }
});

var MealQueryWrapper = React.createClass({
  render: function(){
    return(
      <MealQuery recipes={recipesCollection} query={queryModel} />
    );
  }
});

var ReviewMealsWrapper = React.createClass({
  render: function(){
    return(
      <ReviewMeals recipes={recipesCollection} query={queryModel} mealPlan={mealPlan} />
    );
  }
});

var ShoppingListWrapper = React.createClass({
  render: function(){
    return(
      <ShoppingList mealPlan={mealPlan} />
    );
  }
});


//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  mixins: [Navigation, Backbone.Events],

  getInitialState: function(){
    return {};
  },
  
  render: function() {

    return (
      <div>
        <header>
          <ul>
            <li><Link to="signup">Sign Up</Link></li>
            <li><Link to="login">Log In</Link></li>
            <li><Link to="mealquery">Meal Query</Link></li>
            <li><Link to="reviewmeals">Review Meals</Link></li>
            <li><Link to="shoppinglist">Shopping List</Link></li>
          </ul>
        </header>

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
    <DefaultRoute handler={LogIn} />
  </Route>
);


Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler />, document.body);
});
