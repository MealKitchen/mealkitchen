/** @jsx React.DOM */
var AppView = React.createClass({
  
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
        <Login onSubmit={this.loggedIn} /> 
      );
    } else if(!this.state.querySent){
      return (
        <MealQuery onSubmit={this.querySubmitted} />
      );
    } else if (!this.state.mealPlanSelected) {
      return (
        <ReviewMeals recipes={this.state.queryResults} query={this.state.query} onSubmit={this.mealPlanSubmitted} />
      );
    } else {
      return (
        <ShoppingList mealPlan={this.state.mealPlanModel}/>
      );
    }
  }
});

React.render(<AppView />, document.body);
