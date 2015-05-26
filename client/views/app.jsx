var AppView = React.createClass({
  
  getInitialState: function(){
    return { query: new QueryModel() };
  }

  render: function() {
    if(this.state.query.get(totalRecipesRequested) === 0){
      return (
        <MealQuery query={this.state.query} />
      );
    } else {
      return (
        <ReviewMeals recipes={'RecipesCollection'} />
      );
    }
  }
});

React.render(<AppView />, document.body);
