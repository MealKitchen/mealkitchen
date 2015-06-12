/** @jsx React.DOM */

var Query = React.createClass({

  mixins: [Backbone.Events],

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

  //Every time a user interacts with the form, we need to update the state of the view to reflect that change.
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
        this.setState({allowedAllergies: newAllergies});
        break;
      case 'allowedDiet':
        var newDiet = _.extend({}, this.state.allowedDiet);
        newDiet[value] = event.target.checked;
        this.setState({allowedDiet: newDiet});
        break;
      case 'allowedCuisines':
        var newCuisines = _.extend({}, this.state.allowedCuisines);
        newCuisines[value] = event.target.checked;
        this.setState({allowedCuisines: newCuisines});
        break;
    }
  },

  handleSubmit: function(e){
    e.preventDefault();
    var that = this;

    //Prevent submission if no recipes were requested (meal plans with no recipes are meaningless). The 1X multiplier converts strings to numbers for proper handling.
    if((1*this.state.numBreakfasts) === 0 && (1*this.state.numLunches) === 0 && (1*this.state.numDinners) === 0){
      alert('Please request at least one recipe for Breakfast, Lunch, or Dinner!');
      return;
    }

    var query = new QueryModel();
    query.set({
      allowedCuisines: this.state.allowedCuisines,
      allowedDiet: this.state.allowedDiet,
      allowedAllergies: this.state.allowedAllergies,
      numBreakfasts: this.state.numBreakfasts,
      numLunches: this.state.numLunches,
      numDinners: this.state.numDinners
    });

    //Send a POST request to the server with the QueryModel to get a list of recipes that match the query.
    query.save({}, {
      success: function(model, res){

        console.log('MODEL: ', model);
        console.log('RESPONSE: ', res);

        var breakfastCollection = new RecipesCollection();
        var lunchCollection = new RecipesCollection();
        var dinnerCollection = new RecipesCollection();

        //Generate recipe queues for breakfast, lunch, and dinner. The queues are sorted from 0-length where the recipe at location:length is the closest to the user's palate. When a user rejects a recipe, the next recipe in the queue will be shown.
        var breakfastQ = res.breakfastRecipes;
        var lunchQ = res.lunchRecipes;
        var dinnerQ = res.dinnerRecipes;

        for(var i=0; i<query.get('numBreakfasts'); i++){
          breakfastCollection.add(new RecipeModel(breakfastQ.pop()));
        }
        for(i=0; i<query.get('numLunches'); i++){
          lunchCollection.add(new RecipeModel(lunchQ.pop()));
        }
        for(i=0; i<query.get('numDinners'); i++){
          dinnerCollection.add(new RecipeModel(dinnerQ.pop()));
        }

        //Set the recipeQueue as an attribute on the query model to pass to the reviewmeals view for reference.
        query.set({
          'breakfastQ': breakfastQ,
          'lunchQ': lunchQ,
          'dinnerQ': dinnerQ
        });

        //Set the collections and query on the app state to be passed to other views.
        that.props.setBreakfastCollection(breakfastCollection);
        that.props.setLunchCollection(lunchCollection);
        that.props.setDinnerCollection(dinnerCollection);
        that.props.setQueryModel(query);

        that.props.transitionTo('/reviewmeals');
      },
      error: function(model, err){
        console.error("There was an error with your Meal Query request! ", err);
      }
    });
  },

  _seeMoreToggle: function(e){
    var filter = e.target.dataset.filter;
    switch (filter){
      case 'allowed-allergies':
        this.setState({seeMoreAllergies: !this.state.seeMoreAllergies});
        break;
      case 'allowed-cuisines':
        this.setState({seeMoreCuisines: !this.state.seeMoreCuisines});
        break;
    }
  },

  render: function() {
    var value = this.state.value;

    //FILTER ARRAYS:
    //The following arrays are used for easier rendering of the filter checklists. To add a new option, include it in the correct filter array. Do not delete them or the checklists will not render!
    //The short versions are shown by default, and the user is provided a see more button to see the full list of options.
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

    //Determine whether to show all options or some options for filters based on whether the see more/see less button is clicked.
    var cuisineOptions = this.state.seeMoreCuisines ? allowedCuisines : allowedCuisinesShort;
    var allergyOptions = this.state.seeMoreAllergies ? allowedAllergies : allowedAllergiesShort;
    var dietOptions = allowedDiet;

    return (
      <div className="query-container">
        <h2 className="page-header">Create Meal Plan</h2>

        <form onSubmit={this.handleSubmit}>
          <h3 className="section-header">Select Number of Meals by Type</h3>

          <div className="row">
            <Dropdown name="numDinners" id="numDinners" defaultValue="" type="number" handleChange={this.handleChange} placeHolder="# Dinners" numOptions={7} />
            <Dropdown name="numLunches" id="numLunches" defaultValue="" type="number" handleChange={this.handleChange} placeHolder="# Lunches" numOptions={7} />
            <Dropdown name="numBreakfasts" id="numBreakfasts" defaultValue="" type="number" handleChange={this.handleChange} placeHolder="# Breakfasts" numOptions={7} />
            <input type="submit" value="Create Plan" className="btn btn-primary btn-medium" />
          </div>

          <h3 className="section-header">Additional Filters</h3>
          <div className="row">
            <Checklist label="Food Preferences" filterOptions={dietOptions} name="allowedDiet" handleChange={this.handleChange} />
            <Checklist label="Allergy Restrictions" filterOptions={allergyOptions} name="allowedAllergies" handleChange={this.handleChange} dataFilter="allowed-allergies" seeMore={this.state.seeMoreAllergies} toggle={this._seeMoreToggle} truncated={true} />
            <Checklist label="Cuisine Preferences" filterOptions={cuisineOptions} name="allowedCuisines" handleChange={this.handleChange} dataFilter="allowed-cuisines" seeMore={this.state.seeMoreCuisines} toggle={this._seeMoreToggle} truncated={true} />
          </div>
        </form>
      </div>
    );
  }
});
