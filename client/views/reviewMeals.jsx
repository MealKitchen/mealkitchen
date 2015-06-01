/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var ReviewMeals = React.createClass({

  mixins: [Navigation, Backbone.Events],
  
  //TODO: state should be the recipes collection returned from yummly
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    // set listener on RecipeCollection to re-render view when user rejects recipe
    var that = this;
    this.listenTo(this.props.recipes, 'add remove', function() {
      that.forceUpdate();
    });
  },

  //Every time a user interacts with the recipes, we need to update the state of the view to reflect that change.
  rejectRecipe: function(event) {
    // save id of recipe, and remove recipe from the RecipeCollection
    var modelId = event.target.dataset.id;
    var recipe = this.props.recipes.remove(this.props.recipes.at(modelId));
    var recipeId = recipe.get('id');

    // update queryModel for rejectedRecipeId and totalRecipesRequested to ensure unique recipes from Yummly query
    var totalRecipesRequested = this.props.query.get('totalRecipesRequested');
    this.props.query.set({ "rejectedRecipeId": recipeId, 
                           "totalRecipesRequested": ++totalRecipesRequested });
    
    // add new recipe to RecipeCollection
    var that = this;
    this.props.query.save({}, {
      success: function(model, res) {
        console.log("Response from server:", res);
        that.props.recipes.add(new RecipeModel(res.matches[0]), {at: modelId});
      },
      error: function(model, err) {
        console.error("There was an error with your request! ", err);
      }
    });
  
  },

  //TODO: Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){

    // extract ingredients from each recipe to save in mealPlanModel
    var ingredients = [];
    for (var i = 0; i < this.props.recipes.length; i++) {
      ingredients.push(this.props.recipes.at(i).get("ingredients"));
    }
    ingredients = ingredients.join().split(',');
    
    this.props.mealPlan.set({
      'query': this.props.query,
      'recipes': this.props.recipes,
      'ingredientsList': ingredients,
      'userId': this.props.user.get('id')
    });

    var that = this;
    this.props.mealPlan.save({}, {
      success: function(model, res) {
        console.log("Meal plan saved! Response from server:", res);
        that.transitionTo('shoppinglist');
      },
      error: function(model, err) {
        console.error("There was an error with your request! ", err);
      }
    });
  },

  // dynamically render recipes on page according to RecipesCollection
  render: function() {
      return (
        <div>
          {this.props.recipes.map(function(item, i) {
            return [
              <button data-id={i} onClick={this.rejectRecipe}>X</button>,
              <div key={i}>{item.get('recipeName')}</div>
            ];
          }, this)}
          <button onClick={this.handleSubmit}>Save meal plan</button>
        </div>
      );
    }
});
