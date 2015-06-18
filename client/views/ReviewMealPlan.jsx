/** @jsx React.DOM */

var ReviewMeals = React.createClass({

  mixins: [Backbone.Events],

  //The user has the ability to set the meal plan title from the view.
  getInitialState: function() {
    return { mealPlanTitle: '' };
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  componentDidMount: function() {
    var that = this;

    /*
    LISTENERS
    The following listeners re-render the page whenever a user rejects a recipe so
    that a new recipe suggestion can be displayed.
    */
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

  /*
  RECIPE REJECTION
  When a user does not like a suggested recipe, they have the option to reject it.
  When the recipe gets rejected, a new recipe is suggested, and the user's flavor profile
  is updated. Whenever the queue of recipes runs out, a new request is sent to Yummly to
  refill it.
   */
  _rejectRecipe: function(event) {
    var that = this;
    var modelId = event.target.dataset.position;
    var collection = event.target.dataset.collection;
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

    //Don't allow users to reject a recipe if there are no recipes in the Queue!
    //This clause will force a user to wait until the queue is refilled
    if(courseQueue.length === 0){
      return;
    }

    var rejectedRecipe = this.props[collection].remove(this.props[collection].at(modelId));

    /*
    USER PREFERENCES
    Whenever a recipe is rejected, a preference model with the recipe's id and flavor
    profile is sent to the server to be run through the machine learning algorithm.
    This improves future recipe recommendations by Meal Kitchen.
     */
    var preference = new PreferenceModel(this.props.user);
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
    preference.save();

    /*
    RECIPE QUEUE
    When a user rejects a recipe, the next recipe in the queue is suggested to them. If the queue
    runs out, send a PUT request to the server to refill the queue with relevant recipes.
     */
    var nextRecipe = new RecipeModel(courseQueue.pop());
    that.props[collection].add(nextRecipe, {at: modelId});

    if(courseQueue.length === 0){
      //TODO: set model id's correctly on first save!
      this.props.query.set('id', 'temp');
      this.props.query.save({}, {
        error: function(){
          alert('There was an error with your request, please create a new Meal Plan.');
          window.location.hash('/mealquery');
        }
      });
    }

  },

  handleChange: function(e){
    this.setState({ "mealPlanTitle": e.target.value });
  },

  /*
  SAVING MEAL PLANS
  When a user accepts the suggested recipes, create a Meal Plan model and save it to the server
  with the recipes and user information. The meal plan is stored in the DB and can be recalled
  by the user in future sessions.
   */
  handleSubmit: function(e){
    var that = this;

    if(this.state.mealPlanTitle === ''){
      return alert('Please enter a name for your Meal Plan before continuing!');
    }

    React.findDOMNode(this.refs.submitButton).disabled = true;

    var mealPlan = new MealPlanModel(this.props.user.id);
    mealPlan.set({
      'title': this.state.mealPlanTitle,
      'userId': this.props.user.get('id'),
      'breakfastRecipes': this.props.breakfastCollection,
      'lunchRecipes': this.props.lunchCollection,
      'dinnerRecipes': this.props.dinnerCollection
    });

    mealPlan.save({}, {
      success: function(model, res) {
        model.set({
          'breakfastRecipes': that.props.breakfastCollection,
          'lunchRecipes': that.props.lunchCollection,
          'dinnerRecipes': that.props.dinnerCollection
        });
        that.props.setMealPlan(model);
        that.props.transitionTo('/mealplan');
      },
      error: function(model, err) {
        console.error("There was an error with your request! ", err);
        React.findDOMNode(that.refs.submitButton).disabled = false;
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

              <div className="secondary-container col-md-2">
                <p>Recipe search powered by
                  <a href='http://www.yummly.com/recipes' target="_blank">
                    <img alt='Yummly' src='http://static.yummly.com/api-logo.png'/>
                  </a>
                </p>
              </div>

            </div>

            <div className="secondary-container col-md-2">
              <button
                type="button"
                className="btn btn-primary btn-large"
                ref="submitButton"
                onClick={this.handleSubmit}>
                  Save meal plan
              </button>
            </div>

          </div>
        </div>
      );
    }
});
