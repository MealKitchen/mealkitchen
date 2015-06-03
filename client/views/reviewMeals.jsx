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
    var modelId = event.target.dataset.id;
    var rejectedRecipe = new PreferenceModel(this.props.recipes.remove(this.props.recipes.at(modelId)));
    
    rejectedRecipe.set({
      'preference': false,
      'recipeId': rejectedRecipe.get('id'),
      'userId': this.props.user.get('id')
    });

    //Send rejected recipe preference to the server as POST request for user preferences update
    rejectedRecipe.save();

    // Add new recipe to RecipeCollection from the queue of recipes.
    //TODO: add handling in case recipeQueue is empty!
    var recipeQueue = this.props.query.get('recipeQueue');
    this.props.recipes.add(new RecipeModel(recipeQueue.shift()), {at: modelId});

    //Update the queue to reflect the recipe that was added to the recipes collection.
    this.props.query.set({ 'recipeQueue': recipeQueue });
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
              <div className="recipe" key={i}>
                <button data-id={i} type="button" className="btn btn-default" onClick={this.rejectRecipe}>Reject</button>
                <div>{item.get('recipeName')}</div>
                <img src={item.get('smallImgUrl')}></img>
              </div>
            ];
          }, this)}
          <button onClick={this.handleSubmit}>Save meal plan</button>
        </div>
      );
    }
});
