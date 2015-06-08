/** @jsx React.DOM */

/////////////////////////////////////
///////// BACKBONE STORES ///////////
/////////////////////////////////////

var user = new UserModel();
var mealPlans = new MealPlansCollection();
var mealPlan = new MealPlanModel();
var queryModel = new QueryModel();
var recipesCollection = new RecipesCollection();

var Store = {
  user: null,
  query: null,
  recipesQueue: null,
  mealPlans: null
};

//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  mixins: [Backbone.Events],
  
  getInitialState: function(){
    return {loggedIn: false};
  },

  //Checks authentication before allowing a user to transition to any new location in the application. If a user is not logged in, they are redirected to the login page.
  _transitionTo: function(route){
    var that = this;
    this._isAuth(function(){
      if(!that.state.loggedIn && route !== '/signup'){
        window.location.hash = '/login';
      } else {
        window.location.hash = route;
      }
    });
  },

  //Triggered when a user clicks a link. The event represents the clicked link, and all links have a data-route property with the appropriate route, which gets sent to the _transitionTo method.
  _linkHandler: function(event){
    var route = event.target.dataset.route;
    this._transitionTo(route);
  },

  //Checks the server to see if a user is logged in before executing a callback function.
  _isAuth: function(callback){
    callback = callback || function(){};
    var that = this;
    user.fetch({
      success: function(){
        console.log('user logged in');
        that.setState({loggedIn: true}, function(){
          callback();
        });
      },
      error: function(){
        console.log('user not logged in');
        that.setState({loggedIn: false}, function(){
          callback();
        });
      }
    });
  },

  //Ends a user's session and redirects them to the login page.
  _logOut: function(){
    var that = this;
    $.get("api/logout", function(data) {
      that._transitionTo('/login');
    });
  },
  
  render: function() {

    var Child;
    switch (this.props.route) {
      case '/signup': Child = SignUp; break;
      case '/login': Child = LogIn; break;
      case '/mealquery': Child = MealQuery; break;
      case '/reviewmeals': Child = ReviewMeals; break;
      case '/mealplans': Child = MealPlans; break;
      case '/shoppinglist': Child = ShoppingList; break;
      default:      Child = this.state.loggedIn ? MealQuery : LogIn;
    }

    if(Child !== SignUp && Child !== LogIn && !this.state.loggedIn){
      this._transitionTo('/login');
    }

    return (
      <div className="container-fluid">
        
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a href="/#/login" className="navbar-brand">Meal Kitchen</a>
              <button data-route="/mealquery" type="button" className="btn btn-default" onClick={this._linkHandler}>Create Meal Plan</button>
              <button data-route="/mealplans" type="button" className="btn btn-default" onClick={this._linkHandler}>View Meal Plans</button>
              <button data-route="/login" type="button" className="btn btn-default" onClick={this._linkHandler}>Log In</button>
              <button data-route="/logout" type="button" className="btn btn-default" onClick={this._logOut}>Log Out</button>
            </div>

          </div>
        </nav>

        <header>
          <h1>Meal Kitchen</h1>
        </header>

        <Child isAuth={this._isAuth} linkHandler={this._linkHandler} transitionTo={this._transitionTo} recipes={recipesCollection} query={queryModel} user={user} mealPlan={mealPlan} mealPlans={mealPlans} />

      </div>
    );
  }
});

//Every time the window.location changes, rerender AppView and display the correct children components.
function render () {
  var route = window.location.hash.substr(1);
  React.render(<AppView route={route} />, document.body);
}

//Listen to changes on window.location to rerender the child views.
window.addEventListener('hashchange', render);

//Initial rendering of AppView.
render();
