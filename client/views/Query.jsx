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
      seeMoreDiet: false,
      seeMoreCuisines: false
    };
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  _seeMoreToggle: function(e){
    var filter = e.target.dataset.filter;
    switch (filter){
      case 'allowed-allergies':
        this.setState({seeMoreAllergies: !this.state.seeMoreAllergies});
        break;
      case 'allowed-diet':
        this.setState({seeMoreDiet: !this.state.seeMoreDiet});
        break;
      case 'allowed-cuisines':
        this.setState({seeMoreCuisines: !this.state.seeMoreCuisines});
        break;
    }
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

  //Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var that = this;

    //Prevent submission if no recipes were requested (meal plans with no recipes are meaningless)
    if((1*this.state.numBreakfasts) === 0 && (1*this.state.numLunches) === 0 && (1*this.state.numDinners) === 0){
      alert('Please request at least one recipe for Breakfast, Lunch, or Dinner!');
      return;
    }

    //Send a POST request to the server with the QueryModel to get a list of recipes that match the query.
    var query = new QueryModel();
    query.set({
      allowedCuisines: this.state.allowedCuisines,
      allowedDiet: this.state.allowedDiet,
      allowedAllergies: this.state.allowedAllergies,
      numBreakfasts: this.state.numBreakfasts,
      numLunches: this.state.numLunches,
      numDinners: this.state.numDinners
    });
    query.save({}, {
      success: function(model, res){
        console.log("Response from the server on submitting Meal Query: ", res);

        var breakfastCollection = new RecipesCollection();
        var lunchCollection = new RecipesCollection();
        var dinnerCollection = new RecipesCollection();

        //Generate recipe queues for breakfast, lunch, and dinner. The queues are sorted from 0-length where length is the closest to the user's palate. When a user rejects a recipe, the next recipe in the queue will be shown.
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

  render: function() {
    var value = this.state.value;

    //Determine whether to show all options or some options for filters based on whether the see more/see less button is clicked.
    var cuisineOptions = this.state.seeMoreCuisines ? allowedCuisines : allowedCuisinesShort;
    var allergyOptions = this.state.seeMoreAllergies ? allowedAllergies : allowedAllergiesShort;
    var dietOptions = this.state.seeMoreDiet ? allowedDiet : allowedDietShort;

    return (
      <div className="query-container">

        <h2 className="page-header">Create Meal Plan</h2>

        <form onSubmit={this.handleSubmit}>

          <h3 className="section-header">Select Number of Meals by Type</h3>

          <div className="row">

            <div className="form-group col-md-3">
              <select className="form-control" name="numBreakfasts" id="numBreakfasts" value={value} onChange={this.handleChange} type="number">
                <option value="" disabled selected># Breakfasts</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            <div className="form-group col-md-3">
              <select className="form-control" name="numLunches" id="numLunches" value={value} onChange={this.handleChange} type="number">
                <option value="" disabled selected># Lunches</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            <div className="form-group col-md-3">
              <select className="form-control" name="numDinners" id="numDinners" value={value} onChange={this.handleChange} type="number">
                <option value="" disabled selected># Dinners</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            <input type="submit" value="Create Plan" className="btn btn-primary btn-medium" />

          </div>

          <h3 className="section-header">Additional Filters</h3>

          <div className="row">

            <div className="form-group col-md-3">
              <div className="filter-label">Food Preferences</div>
                {dietOptions.map(function(item, i){
                  return [
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" name='allowedDiet' value={item} className="checkbox" onChange={this.handleChange} />{item}
                      </label>
                    </div>
                  ];
                }, this)}
                <div className='toggle-filter' data-filter='allowed-diet' onClick={this._seeMoreToggle}>
                  <span data-filter='allowed-diet'>{this.state.seeMoreDiet ? 'See less ' : 'See more '}</span>
                  <span data-filter='allowed-diet' className={this.state.seeMoreDiet ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down"} aria-hidden="true"></span>
                </div>
            </div>

            <div className="form-group col-md-3">
              <div className="filter-label">Allergy Restrictions</div>
                {allergyOptions.map(function(item, i){
                  return [
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" name='allowedAllergies' value={item} className="checkbox" onChange={this.handleChange} />{item}
                      </label>
                    </div>
                  ];
                }, this)}
                <div className='toggle-filter' data-filter='allowed-allergies' onClick={this._seeMoreToggle}>
                  <span data-filter='allowed-allergies'>{this.state.seeMoreAllergies ? 'See less ' : 'See more '}</span>
                  <span data-filter='allowed-allergies' className={this.state.seeMoreAllergies ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down"} aria-hidden="true"></span>
                </div>
            </div>

            <div className="form-group col-md-3">
              <div className="filter-label">Cuisine Preferences</div>
                {cuisineOptions.map(function(item, i){
                  return [
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" name='allowedCuisines' value={item} className="checkbox" onChange={this.handleChange} />{item}
                      </label>
                    </div>
                  ];
                }, this)}
                <div className='toggle-filter' data-filter='allowed-cuisines' onClick={this._seeMoreToggle}>
                  <span data-filter='allowed-cuisines'>{this.state.seeMoreCuisines ? 'See less ' : 'See more '}</span>
                  <span data-filter='allowed-cuisines' className={this.state.seeMoreCuisines ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down"} aria-hidden="true"></span>
                </div>
            </div>

          </div>

        </form>

      </div>
    );
  }
});


//The following arrays are for easier rendering of the filter checklists in the render method above. Do not delete them or the checklists will not render!

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

var allowedAllergiesShort = [
  "Egg-Free",
  "Gluten-Free",
  "Peanut-Free",
  "Seafood-Free",
  "Sesame-Free",
  "Soy-Free"
];

var allowedDiet = [
  "Pescatarian",
  "Vegan",
  "Paleo",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Lacto-Ovo-Vegetarian"
];

var allowedDietShort = [
  "Pescatarian",
  "Vegan",
  "Paleo",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Lacto-Ovo-Vegetarian",
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

var allowedCuisinesShort = [
  "American",
  "Asian",
  "Barbecue",
  "Cajun & Creole",
  "Chinese",
  "Cuban"
];
