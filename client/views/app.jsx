/** @jsx React.DOM */
var AppView = React.createClass({
  
  getInitialState: function(){
    return {
      querySent: false,
      queryResults: null,
      planApproved: false,
      query: null,
      mealPlanSelected: null,
      ingredientsList: null
    };
  },

  querySubmitted: function(recipesCollection, queryModel){
    this.setState( {querySent: true, queryResults: recipesCollection, query: queryModel } );
  },

  mealPlanSubmitted: function (ingredients) {
    this.setState({mealPlanSelected: true, ingredientsList: ingredients});
  },

  render: function() {
    if(!this.state.querySent){
      return (
        <MealQuery onSubmit={this.querySubmitted} />
      );
    } else if (!this.state.mealPlanSelected) {
      return (
        <ReviewMeals recipes={this.state.queryResults} query={this.state.query} onSubmit={this.mealPlanSubmitted} />
      );
    } else {
      return (
        <ShoppingList ingredients={this.state.ingredientsList}/>
      );
    }
  }
});

React.render(<AppView />, document.body);
