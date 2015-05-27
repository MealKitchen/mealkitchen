/** @jsx React.DOM */
var AppView = React.createClass({
  
  getInitialState: function(){
    return {
      querySent: false,
      queryResults: null,
      planApproved: false
     };
  },

  querySubmitted: function(recipesCollection){
    this.setState( {querySent: true, queryResults: recipesCollection} );
  },

  render: function() {
    if(!this.state.querySent){
      return (
        <MealQuery onSubmit={this.querySubmitted} />
      );
    } else {
      return (
        <ReviewMeals recipes={this.state.queryResults} />
      );
    }
  }
});

React.render(<AppView />, document.body);
