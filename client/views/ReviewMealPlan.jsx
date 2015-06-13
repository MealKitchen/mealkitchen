/** @jsx React.DOM */

var ReviewMeals = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function() {
    return { mealPlanTitle: '' };
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  componentDidMount: function() {

    /*
    LISTENERS
    The following listeners re-render the page whenever a user rejects a recipe so
    that a new recipe suggestion can be displayed.
    */

    var that = this;

    this.listenTo(this.props.breakfastCollection, 'add remove', function() {
      that.forceUpdate();
    });

    this.listenTo(this.props.lunchCollection, 'add remove', function() {
      that.forceUpdate();
    });

    this.listenTo(this.props.dinnerCollection, 'add remove', function() {
      that.forceUpdate();
    });

  },

  //Every time a user interacts with the recipes, we need to update the state of the view to reflect that change.
  _rejectRecipe: function(event) {
    var modelId = event.target.dataset.position;
    var collection = event.target.dataset.collection;
    var preference = new PreferenceModel();
    var courseQueue;

    switch (collection){
      case "breakfastCollection":
        courseQueue = this.props.query.get('breakfastRecipes');
        this.props.query.incrementOffset('breakfast');
        break;
      case "lunchCollection":
        courseQueue = this.props.query.get('lunchRecipes');
        this.props.query.incrementOffset('lunch');
        break;
      case "dinnerCollection":
        courseQueue = this.props.query.get('dinnerRecipes');
        this.props.query.incrementOffset('dinner');
        break;
    }

    var rejectedRecipe = this.props[collection].remove(this.props[collection].at(modelId));

    if(!rejectedRecipe.get('flavors')){
      preference.set({
        'preference': false,
        'recipeId': rejectedRecipe.get('id'),
        'userId': this.props.user.get('id'),
        'course': rejectedRecipe.get('attributes').course[0]
      });
    } else {
      preference.set({
        'preference': false,
        'recipeId': rejectedRecipe.get('id'),
        'userId': this.props.user.get('id'),
        'course': rejectedRecipe.get('attributes').course[0],
        'salty': rejectedRecipe.get('flavors').salty,
        'sour': rejectedRecipe.get('flavors').sour,
        'sweet': rejectedRecipe.get('flavors').sweet,
        'bitter': rejectedRecipe.get('flavors').bitter,
        'meaty': rejectedRecipe.get('flavors').meaty,
        'piquant': rejectedRecipe.get('flavors').piquant
      });
    }

    //Send rejected recipe preference to the server as POST request for user preferences update.
    preference.save({}, {
      success: function(model, res){
        console.log('success!');
        console.log('model', model);
        console.log('res', res);
      },
      error: function(model, err){
        console.log('error!');
        console.log('model', model);
        console.log('err', err);
      }
    });

    // Add new recipe to collection from the queue of recipes.
    //TODO: add handling in case queues are empty!
    if(courseQueue.length === 0){
      this.props.query.set('id', 'temp');
      this.props.query.save();
    } else {
      this.props[collection].add(new RecipeModel(courseQueue.pop()), {at: modelId});
    }

  },

  handleChange: function(e){
    this.setState({ "mealPlanTitle": e.target.value });
  },

  //TODO: Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    var mealPlan = new MealPlanModel({
      'title': this.state.mealPlanTitle,
      'userId': this.props.user.get('id'),
      'breakfastRecipes': this.props.breakfastCollection,
      'lunchRecipes': this.props.lunchCollection,
      'dinnerRecipes': this.props.dinnerCollection
    });

    var that = this;
    mealPlan.save({}, {
      success: function(model, res) {
        console.log("Meal plan saved! Response from server:", res);
        that.props.setMealPlan(mealPlan);
        that.props.transitionTo('/mealplan');
      },
      error: function(model, err) {
        console.error("There was an error with your request! ", err);
      }
    });
  },

  render: function() {
      return (
        <div className="split-container">
          <div className="row">
            <div className="primary-container col-md-10">
              <h2 className="page-header">Review Meal Plan</h2>

              <input
                type="text"
                className="form-control meal-plan-name"
                name="mealPlanTitle"
                placeholder="Enter Meal Plan Name"
                value={this.value}
                onChange={this.handleChange} />

              <div className="course-container">
                <h3 className="section-header">Dinner</h3>
                <div className="row">

                  {this.props.dinnerCollection.map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={true}
                        collection='dinnerCollection'
                        rejectRecipe={this._rejectRecipe} />
                    ];
                  }, this)}

                </div>
              </div>

              <div className="course-container">
                <h3 className="section-header">Lunch</h3>
                <div className="row">

                  {this.props.lunchCollection.map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={true}
                        collection='lunchCollection'
                        rejectRecipe={this._rejectRecipe} />
                    ];
                  }, this)}

                </div>
              </div>

              <div className="course-container">
                <h3 className="section-header">Breakfast</h3>
                <div className="row">

                  {this.props.breakfastCollection.map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={true}
                        collection='breakfastCollection'
                        rejectRecipe={this._rejectRecipe} />
                    ];
                  }, this)}

                </div>
              </div>

            </div>
            <div className="secondary-container col-md-2">

              <button
                type="button"
                className="btn
                btn-primary
                btn-large"
                onClick={this.handleSubmit}>
                  Save meal plan
              </button>

            </div>
          </div>
        </div>
      );
    }
});
