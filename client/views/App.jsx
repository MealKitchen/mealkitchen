/** @jsx React.DOM */

//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  /*
  APP STATE
  The app state acts as a store for all models and collections that need to be passed between views.
  Much of the contents of the store is created in child views, so App State setters are provided and passed
  to children.
  */

  getInitialState: function(){
    return {
      loggedIn: false,
      bgImage: true,
      user: null,
      mealPlans: null,
      mealPlan: null,
      queryModel: null,
      breakfastCollection: null,
      lunchCollection: null,
      dinnerCollection: null,
      shoppingList: null
    };
  },

  /*
  APP STATE SET METHODS
  The following _set methods are defined and passed to children to allow child view
  controller code to set models and collections on the app state.
  */
  _setUser: function(user){
    this.setState({ user: user });
  },

  _setMealPlans: function(mealPlans){
    this.setState({ mealPlans: mealPlans });
  },

  _setMealPlan: function(mealPlan){
    this.setState({ mealPlan: mealPlan });
  },

  _setQueryModel: function(queryModel){
    this.setState({ queryModel: queryModel });
  },

  _setBreakfastCollection: function(breakfastCollection){
    this.setState({ breakfastCollection: breakfastCollection });
  },

  _setLunchCollection: function(lunchCollection){
    this.setState({ lunchCollection: lunchCollection });
  },

  _setDinnerCollection: function(dinnerCollection){
    this.setState({ dinnerCollection: dinnerCollection });
  },

  _setShoppingList: function(shoppingList){
    this.setState({ shoppingList: shoppingList });
  },

  _setBGImg: function(bool){
    this.setState({ bgImage: bool });
  },

  /*
  AUTHENTICATION
  Sessions are handled by the server, and there is a loggedIn property stored on the App State
  for convenience. When a user tries to visit a page in the app, their authentication status is
  first checked against the server, and if they are not logged in, they are redirected to the login page.
  */
  _transitionTo: function(route){
    var that = this;
    if(route === '/signup' || route === '/login'){
      window.location.hash = route;
    } else {
      this._isAuth(function(){
        if(!that.state.loggedIn){
          window.location.hash = '/login';
        } else {
          window.location.hash = route;
        }
      });
    }
  },

  _linkHandler: function(event){
    var route = event.target.dataset.route;
    this._transitionTo(route);
  },

  _isAuth: function(callback){
    callback = callback || function(){};
    var that = this;
    if(!this.state.user){
      window.location.hash = '/login';
    } else {
      this.state.user.fetch({
        success: function(){
          that.setState({ loggedIn: true }, function(){
            callback();
          });
        },
        error: function(){
          that.setState({ loggedIn: false }, function(){
            callback();
          });
        }
      });
    }
  },

  _logOut: function(){
    this.replaceState(this.getInitialState());
    $.get("api/logout", function(data) {
      window.location.hash = '/login';
    });
  },


  /*
  APP RENDER
  This function renders the App View, which acts as a container for the entire application.
  You will find an internal router as well as a system for passing props to children inside
  of this method.
   */
  render: function() {

    /*
    INTERNAL ROUTER
    Whenever the State changes on the app, the appropriate view is selected and rendered
    by the internal router.
     */

    var Child;
    switch (this.props.route) {
      case '':
        Child = LandingPage;
        break;
      case '/signup':
        Child = SignUp;
        break;
      case '/login':
        Child = LogIn;
        break;
      case '/mealquery':
        Child = Query;
        break;
      case '/reviewmeals':
        Child = ReviewMeals;
        break;
      case '/mealplans':
        Child = MealPlanLibrary;
        break;
      case '/mealplan':
        Child = MealPlan;
        break;
      case '/shoppinglist':
        Child = ShoppingList;
        break;
      default:
        Child = this.state.loggedIn ? MealPlanLibrary : LogIn;
    }

    //If a user is not logged in and tries to access internal app content, redirect them to login.
    if(Child !== SignUp && Child !== LogIn && Child !== LandingPage && !this.state.loggedIn){
      Child = LogIn;
    }

    //If a user tries to visit review meals without first submitting a query, redirect them to Query.
    if(!this.state.queryModel && Child === ReviewMeals){
      window.location.hash = '/mealquery';
      Child = Query;
    }

    /*
    PASSING PROPS
    Setters and App State are passed to children views below.
    The navbar changes based on the bgImage property, and the
    correct child component is selected by the router.
     */
    return (
      <div className = {this.state.bgImage ? "background-image" : ""}>

        <Navbar
          bgImage = {this.state.bgImage}
          linkHandler = {this._linkHandler}
          logOut = {this._logOut} />

        <Child
          setBGImg = {this._setBGImg}
          isAuth = {this._isAuth}
          linkHandler = {this._linkHandler}
          transitionTo = {this._transitionTo}
          breakfastCollection = {this.state.breakfastCollection}
          lunchCollection = {this.state.lunchCollection}
          dinnerCollection = {this.state.dinnerCollection}
          query = {this.state.queryModel}
          user = {this.state.user}
          mealPlan = {this.state.mealPlan}
          mealPlans = {this.state.mealPlans}
          ingredients = {this.state.ingredientsCollection}
          setUser = {this._setUser}
          setMealPlans = {this._setMealPlans}
          setMealPlan = {this._setMealPlan}
          setQueryModel = {this._setQueryModel}
          setBreakfastCollection = {this._setBreakfastCollection}
          setLunchCollection = {this._setLunchCollection}
          setDinnerCollection = {this._setDinnerCollection}
          setShoppingList = {this._setShoppingList} />

      </div>
    );
  }
});

/*
EXTERNAL ROUTER
The external router listens for changes on the window.location property, and
executes the App View router when necesarry. If a user tries to access review
meals, they get redirected to the Query View since there are no recipes to review!
 */

function render () {
  var route = window.location.hash.substr(1);
  React.render(<AppView route={route} />, document.body);
}
window.addEventListener('hashchange', render);
render();
