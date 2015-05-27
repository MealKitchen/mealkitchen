/** @jsx React.DOM */
var AppView = React.createClass({
  
  getInitialState: function(){
    return {
      querySent: false,
      queryResults: null,
      planApproved: false,
      query: null
     };
  },

  querySubmitted: function(recipesCollection, queryModel){
    this.setState( {querySent: true, queryResults: recipesCollection, query: queryModel } );
  },

  render: function() {
    if(!this.state.querySent){
      return (
        <MealQuery onSubmit={this.querySubmitted} />
      );
    } else {
      return (
        <ReviewMeals recipes={this.state.queryResults} query={this.state.query} />
      );
    }
  }
});

React.render(<AppView />, document.body);
