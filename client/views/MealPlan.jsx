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

  _createShoppingList: function(){
    var that = this;
    var mealPlanId = {mealPlanId: that.props.mealPlan.get('mealPlanId')};
    $.ajax({
      type: "POST",
      url: "api/recipes/ingredients",
      data: JSON.stringify(mealPlanId),
      dataType: "json",
      contentType: "application/json",
      success: function(res){
        console.log("response: ", res);
        that.props.setIngredientsCollection(res);
        that.props.transitionTo('/shoppinglist');
      }
    });
  },

  // dynamically render recipes on page according to Meal Plan
  render: function() {
      return (
        <div className="split-container">

          <div className="primary-container">

            <h1 className="page-header">Meal Plan: {this.props.mealPlan.get('title')}</h1>

            <div className="course-container">
              <h3 className="section-header">Breakfast</h3>
              {this.props.mealPlan.get('breakfastRecipes').map(function(item, i) {
                return [
                  <Recipe recipe={item} position={i} forReview={false} collection='breakfastCollection' />
                ];
              }, this)}
            </div>

            <div className="course-container">
              <h3 className="section-header">Lunch</h3>
              {this.props.mealPlan.get('lunchRecipes').map(function(item, i) {
                return [
                  <Recipe recipe={item} position={i} forReview={false} collection='lunchCollection' />
                ];
              }, this)}
            </div>

            <div className="course-container">
              <h3 className="section-header">Dinner</h3>
              {this.props.mealPlan.get('dinnerRecipes').map(function(item, i) {
                return [
                  <Recipe recipe={item} position={i} forReview={false} collection='dinnerCollection' />
                ];
              }, this)}
            </div>

          </div>

          <div className="secondary-container">
            <button className="btn btn-primary btn-large" type='button' onClick={this._createShoppingList}>Create Shopping List</button>
          </div>

        </div>
      );
    }
});
