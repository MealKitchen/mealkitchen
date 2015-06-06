/** @jsx React.DOM */

var MealPlan = React.createClass({

  render : function() {
    return (
      <div>
        <h1>Meal Plan</h1>
        {this.props.mealPlan.map(function(recipe, i) {
            return (
              <div className="mealPlanContainer" key={i}>
                <div className="recipe">{recipe.recipeName}</div>
                <img className="recipeImage" src={recipe.smallImgUrl}></img>
              </div>
            )
          }, this)}
      </div>
    );
  }
});
