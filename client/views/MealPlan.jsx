/** @jsx React.DOM */

var MealPlan = React.createClass({

  mixins: [Backbone.Events],

  //TODO: state should be the recipes collection returned from yummly
  getInitialState: function() {
    return {};
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  // _createShoppingList: function(){

  // },

  // dynamically render recipes on page according to Meal Plan
  render: function() {
      return (
        <div>

          <h1>Meal Plan: {this.props.mealPlan.get('title')}</h1>

          <div className="container breakfast">
            <h3>Breakfast</h3>
            {this.props.mealPlan.get('breakfastRecipes').map(function(item, i) {
              return [
                <Recipe recipe={item} position={i} forReview={false} collection='breakfastCollection' />
              ];
            }, this)}
          </div>

          <div className="container lunch">
            <h3>Lunch</h3>
            {this.props.mealPlan.get('lunchRecipes').map(function(item, i) {
              return [
                <Recipe recipe={item} position={i} forReview={false} collection='lunchCollection' />
              ];
            }, this)}
          </div>

          <div className="container dinner">
            <h3>Dinner</h3>
            {this.props.mealPlan.get('dinnerRecipes').map(function(item, i) {
              return [
                <Recipe recipe={item} position={i} forReview={false} collection='dinnerCollection' />
              ];
            }, this)}
          </div>

        </div>
      );
    }
});
