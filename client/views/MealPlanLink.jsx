/** @jsx React.DOM */

var MealPlanLink = React.createClass({

  render : function() {
    return (
      <div>
        
        <h1>Meal Plan Library ({this.props.mealPlan.length})</h1>

        <div className="createMealPlan">
          <img className="plus" src=""></img>
          <p>Create New Meal Plan</p>
        </div>
        {this.props.mealPlan.map(function(recipe, i) {
            return (
              <div className="mealPlanLink" key={i}>
                <div className="recipe">{recipe.recipeName}</div>
                <img className="recipeImage" src={recipe.smallImgUrl}></img>
              </div>
            )
          }, this)}
      </div>
    );
  }
});
