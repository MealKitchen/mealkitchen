/** @jsx React.DOM */

/////////////////////////////////////
///////// BACKBONE STORES ///////////
/////////////////////////////////////

var user = new UserModel();
var mealPlans = new MealPlansCollection();
var mealPlan = new MealPlanModel();
var queryModel = new QueryModel();
var breakfastCollection = new RecipesCollection();
var lunchCollection = new RecipesCollection();
var dinnerCollection = new RecipesCollection();

//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  mixins: [Backbone.Events],
  
  getInitialState: function(){
    return {
      loggedIn: false,
      bgImage: true
    };
  },

  _setBGImg: function(bool){
    this.setState({bgImage: bool});
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
  
  render: function() {

    var Child;
    switch (this.props.route) {
      case '': Child = LandingPage; break;
      case '/signup': Child = SignUp; break;
      case '/login': Child = LogIn; break;
      case '/mealquery': Child = Query; break;
      case '/reviewmeals': Child = ReviewMeals; break;
      case '/mealplans': Child = MealPlanLibrary; break;
      case '/mealplan': Child = MealPlan; break;
      case '/shoppinglist': Child = ShoppingList; break;
      default:      Child = this.state.loggedIn ? MealQuery : LogIn;
    }

    if(Child !== SignUp && Child !== LogIn && Child !== LandingPage && !this.state.loggedIn){
      this._transitionTo('/login');
    }

    return (
      <div className="container-fluid">
        
        <Navbar bgImage={this.state.bgImage} linkHandler={this._linkHandler} />

        <Child setBGImg={this._setBGImg} isAuth={this._isAuth} linkHandler={this._linkHandler} transitionTo={this._transitionTo} breakfastCollection={breakfastCollection} lunchCollection={lunchCollection} dinnerCollection={dinnerCollection} query={queryModel} user={user} mealPlan={mealPlan} mealPlans={mealPlans} />

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
