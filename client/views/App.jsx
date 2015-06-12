/** @jsx React.DOM */

//The AppView is the main container from which the rest of the App is rendered.
var AppView = React.createClass({

  mixins: [Backbone.Events],

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
      ingredientsCollection: null
    };
  },

  _setUser: function(user){
    this.setState({user: user});
  },

  _setMealPlans: function(mealPlans){
    this.setState({mealPlans: mealPlans});
  },

  _setMealPlan: function(mealPlan){
    this.setState({mealPlan: mealPlan});
  },

  _setQueryModel: function(queryModel){
    this.setState({queryModel: queryModel});
  },

  _setBreakfastCollection: function(breakfastCollection){
    this.setState({breakfastCollection: breakfastCollection});
  },

  _setLunchCollection: function(lunchCollection){
    this.setState({lunchCollection: lunchCollection});
  },

  _setDinnerCollection: function(dinnerCollection){
    this.setState({dinnerCollection: dinnerCollection});
  },

  _setIngredientsCollection: function(ingredientsCollection){
    this.setState({ingredientsCollection: ingredientsCollection});
  },

  _setBGImg: function(bool){
    this.setState({bgImage: bool});
  },

  _logOut: function(){
    this.replaceState(this.getInitialState());
    $.get("api/logout", function(data) {
      window.location.hash = '/login';
    });
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
    if(!this.state.user){
      window.location.hash = '/login';
    } else {
      this.state.user.fetch({
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
    }
  },

  render: function() {
    console.log(this.state);

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
      default:      Child = this.state.loggedIn ? MealPlanLibrary : LogIn;
    }

    if(Child !== SignUp && Child !== LogIn && Child !== LandingPage && !this.state.loggedIn){
      window.location.hash = '/login';
    }

    return (
      <div className={this.state.bgImage ? "background-image" : ""}>

        <Navbar bgImage={this.state.bgImage} linkHandler={this._linkHandler} logOut={this._logOut} />

        <Child
          setBGImg={this._setBGImg}
          isAuth={this._isAuth}
          linkHandler={this._linkHandler}
          transitionTo={this._transitionTo}
          breakfastCollection={this.state.breakfastCollection}
          lunchCollection={this.state.lunchCollection}
          dinnerCollection={this.state.dinnerCollection}
          query={this.state.queryModel}
          user={this.state.user}
          mealPlan={this.state.mealPlan}
          mealPlans={this.state.mealPlans}
          ingredients={this.state.ingredientsCollection}
          setUser={this._setUser}
          setMealPlans={this._setMealPlans}
          setMealPlan={this._setMealPlan}
          setQueryModel={this._setQueryModel}
          setBreakfastCollection={this._setBreakfastCollection}
          setLunchCollection={this._setLunchCollection}
          setDinnerCollection={this._setDinnerCollection}
          setIngredientsCollection={this._setIngredientsCollection} />

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
