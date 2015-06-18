/** @jsx React.DOM */

var Query = React.createClass({

  mixins: [Backbone.Events],

  /*
  QUERY STATE
  All of the properties of the Query are stored here. They are selected in the form
  inside of the render method of this view.
   */
  getInitialState: function() {
    return {
      allowedAllergies: {},
      allowedCuisines: {},
      allowedDiet: {},
      numBreakfasts: 0,
      numLunches: 0,
      numDinners: 0,
      seeMoreAllergies: false,
      seeMoreCuisines: false
    };
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  /*
  FORM CONTROLLER CODE
  When a user makes a selection on the form, the selection is reflected in the
  Query State through the handleChange method below.
   */
  handleChange: function(event) {
    var name = event.target.name;
    var value = event.target.value;
    switch (name){
      case 'numBreakfasts':
        this.setState({ numBreakfasts: value });
        break;
      case 'numLunches':
        this.setState({ numLunches: value });
        break;
      case 'numDinners':
        this.setState({ numDinners: value });
        break;
      case 'allowedAllergies':
        var newAllergies = _.extend({}, this.state.allowedAllergies);
        newAllergies[value] = event.target.checked;
        this.setState({ allowedAllergies: newAllergies });
        break;
      case 'allowedDiet':
        var newDiet = _.extend({}, this.state.allowedDiet);
        newDiet[value] = event.target.checked;
        this.setState({ allowedDiet: newDiet });
        break;
      case 'allowedCuisines':
        var newCuisines = _.extend({}, this.state.allowedCuisines);
        newCuisines[value] = event.target.checked;
        this.setState({ allowedCuisines: newCuisines });
        break;
    }
  },

  /*
  QUERY SUBMISSION
  When a user submits a query, a query model is created and sent to the server as a POST request
  to pull relevant recipes from Yummly. The response is set on the Query Model which is then
  passed to the Review Meal Plan view for user feedback.
   */
  handleSubmit: function(e){
    e.preventDefault();
    React.findDOMNode(this.refs.submitButton).disabled = true;
    var that = this;

    //Prevent submission if no recipes are requested.
    if((1*this.state.numBreakfasts) === 0 && (1*this.state.numLunches) === 0 && (1*this.state.numDinners) === 0){
      alert('Please request at least one recipe for Breakfast, Lunch, or Dinner!');
      return;
    }

    var query = new QueryModel({
      allowedCuisines: this.state.allowedCuisines,
      allowedDiet: this.state.allowedDiet,
      allowedAllergies: this.state.allowedAllergies,
      numBreakfasts: this.state.numBreakfasts,
      numLunches: this.state.numLunches,
      numDinners: this.state.numDinners
    });

    query.save({}, {
      success: function(model, res){

        /*
        COURSE COLLECTIONS
        The course collections live on the App State and contain all of the current
        recipe suggestions for each course. They are pulled in order of relevance from
        a queue of recipes returned from the server.
         */
        var breakfastCollection = new RecipesCollection();
        for(var i=0; i<query.get('numBreakfasts'); i++){
          breakfastCollection.add(new RecipeModel(model.get('breakfastRecipes').pop()));
        }

        var lunchCollection = new RecipesCollection();
        for(i=0; i<query.get('numLunches'); i++){
          lunchCollection.add(new RecipeModel(model.get('lunchRecipes').pop()));
        }

        var dinnerCollection = new RecipesCollection();
        for(i=0; i<query.get('numDinners'); i++){
          dinnerCollection.add(new RecipeModel(model.get('dinnerRecipes').pop()));
        }

        //Set the collections and query on the app state to be passed to other views.
        that.props.setBreakfastCollection(breakfastCollection);
        that.props.setLunchCollection(lunchCollection);
        that.props.setDinnerCollection(dinnerCollection);
        that.props.setQueryModel(query);

        that.props.transitionTo('/reviewmeals');
      },
      error: function(model, err){
        React.findDOMNode(that.refs.submitButton).disabled = false;
        if(err.status === 406) {
          alert("There was an error with your request, please try adjusting your filters.");
        } else {
          alert("There was an error with Yummly, please refresh the page and try again.")
        }
      }
    });
  },

  /*
  SEE MORE TOGGLE
  This method is used to determine how many filter options to display on the page.
  It gets called from within the checklist view, and its state is kept on the Query State.
   */
  _seeMoreToggle: function(e){
    var filter = e.target.dataset.filter;
    switch (filter){
      case 'allowed-allergies':
        this.setState({ seeMoreAllergies: !this.state.seeMoreAllergies });
        break;
      case 'allowed-cuisines':
        this.setState({ seeMoreCuisines: !this.state.seeMoreCuisines });
        break;
    }
  },

  render: function() {

    /*
    FILTER ARRAYS:
    The following arrays are used for easier rendering of the filter checklists.
    To add a new option, include it in the correct filter array.
    The short versions are shown by default, and a see more button is available to see the full list.
    */
    var allowedAllergiesShort = [
      "Egg-Free",
      "Gluten-Free",
      "Peanut-Free",
      "Seafood-Free",
      "Sesame-Free",
      "Soy-Free"
    ];

    var allowedAllergies = [
      "Egg-Free",
      "Gluten-Free",
      "Peanut-Free",
      "Seafood-Free",
      "Sesame-Free",
      "Soy-Free",
      "Sulfite-Free",
      "Tree Nut-Free",
      "Wheat-Free"
    ];

    var allowedDiet = [
      "Vegetarian",
      "Vegan",
      "Pescetarian",
      "Paleo",
      "Lacto-Vegetarian",
      "Ovo-Vegetarian"
    ];

    var allowedCuisinesShort = [
      "American",
      "Asian",
      "Barbecue",
      "Cajun & Creole",
      "Chinese",
      "Cuban"
    ];

    var allowedCuisines = [
      "American",
      "Asian",
      "Barbecue",
      "Cajun & Creole",
      "Chinese",
      "Cuban",
      "English",
      "French",
      "German",
      "Greek",
      "Hawaiian",
      "Hungarian",
      "Indian",
      "Irish",
      "Italian",
      "Japanese",
      "Kid-Friendly",
      "Mediterranean",
      "Mexican",
      "Moroccan",
      "Portuguese",
      "Southern & Soul Food",
      "Southwestern",
      "Spanish",
      "Swedish",
      "Thai"
    ];

    //Determine whether to show all or some options for filters based on whether the see more button is clicked.
    var cuisineOptions = this.state.seeMoreCuisines ? allowedCuisines : allowedCuisinesShort;
    var allergyOptions = this.state.seeMoreAllergies ? allowedAllergies : allowedAllergiesShort;
    var dietOptions = allowedDiet;

    return (
      <div className="query-container">
        <h2 className="page-header">Create Meal Plan</h2>

        <form onSubmit={this.handleSubmit}>
          <h3 className="section-header">Select Number of Meals by Type</h3>

          <div className="row">

            <Dropdown
              name="numDinners"
              id="numDinners"
              defaultValue=""
              type="number"
              handleChange={this.handleChange}
              placeHolder="# Dinners"
              numOptions={7} />

            <Dropdown
              name="numLunches"
              id="numLunches"
              defaultValue=""
              type="number"
              handleChange={this.handleChange}
              placeHolder="# Lunches"
              numOptions={7} />

            <Dropdown
              name="numBreakfasts"
              id="numBreakfasts"
              defaultValue=""
              type="number"
              handleChange={this.handleChange}
              placeHolder="# Breakfasts"
              numOptions={7} />

            <input
              type="submit"
              value="Create Plan"
              ref="submitButton"
              className="btn btn-primary btn-medium" />

          </div>

          <h3 className="section-header">Additional Filters</h3>
          <div className="row">

            <Checklist
              label="Food Preferences"
              filterOptions={dietOptions}
              name="allowedDiet"
              handleChange={this.handleChange} />

            <Checklist
              label="Allergy Restrictions"
              filterOptions={allergyOptions}
              name="allowedAllergies"
              handleChange={this.handleChange}
              dataFilter="allowed-allergies"
              seeMore={this.state.seeMoreAllergies}
              toggle={this._seeMoreToggle}
              truncated={true} />

            <Checklist
              label="Cuisine Preferences"
              filterOptions={cuisineOptions}
              name="allowedCuisines"
              handleChange={this.handleChange}
              dataFilter="allowed-cuisines"
              seeMore={this.state.seeMoreCuisines}
              toggle={this._seeMoreToggle}
              truncated={true} />

          </div>
        </form>
      </div>
    );
  }
});
