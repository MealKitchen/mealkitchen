var ReviewMeals = React.createClass({
  
  //TODO: state should be the recipes collection returned from yummly
  getInitialState: function() {
    return null;
  },

  //Every time a user interacts with the recipes, we need to update the state of the view to reflect that change.
  handleChange: function(event) {

  },

  //TODO: Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    //TODO: save a MealPlan model to a user's mealplan collection, and to the db
  },

  //TODO: dynamically render recipes on page according to model (specifically, nummeals)
  render: function() {
      return (
        <div>
          {this.props.recipes.map(function(item, i) {
            return (
              <div key={i}>{item.get('recipeName')}</div>
            );
          }, this)}
        </div>
      );
    }
});
