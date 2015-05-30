/** @jsx React.DOM */
var AppView = React.createClass({displayName: "AppView",
  
  getInitialState: function(){
    return {
      userLoggedIn: true,
      querySent: false,
      queryResults: null,
      planApproved: false,
      query: null,
      mealPlanSelected: null,
      mealPlanModel: null
    };
  },

  querySubmitted: function(recipesCollection, queryModel){
    this.setState( {querySent: true, queryResults: recipesCollection, query: queryModel } );
  },

  mealPlanSubmitted: function (mealPlan) {
    this.setState({mealPlanSelected: true, mealPlanModel: mealPlan});
  },

  loggedIn: function(){
    this.setState({userLoggedIn: true});
  },

  render: function() {
    if(!this.state.userLoggedIn){
      return (
        React.createElement(Login, {onSubmit: this.loggedIn}) 
      );
    } else if(!this.state.querySent){
      return (
        React.createElement(MealQuery, {onSubmit: this.querySubmitted})
      );
    } else if (!this.state.mealPlanSelected) {
      return (
        React.createElement(ReviewMeals, {recipes: this.state.queryResults, query: this.state.query, onSubmit: this.mealPlanSubmitted})
      );
    } else {
      return (
        React.createElement(ShoppingList, {mealPlan: this.state.mealPlanModel})
      );
    }
  }
});

React.render(React.createElement(AppView, null), document.body);
