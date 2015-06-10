/** @jsx React.DOM */

var Query = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function() {
    return {
      allowedAllergies: null,
      allowedCuisines: null,
      allowedDiet: null,
      numBreakfasts: 0,
      numLunches: 0,
      numDinners: 0
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

  //Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var that = this;

    //Send a POST request to the server with the QueryModel to get a list of recipes that match the query.
    var query = new QueryModel(this.state);
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
    return (
      <div className="query container">
        <h2>Create Meal Plan</h2>

        <form onSubmit={this.handleSubmit}>

          <h3>Select Number of Meals by Type</h3>

          <div className="row">

            <div className="form-group breakfasts col-md-3">
              <label htmlFor="numBreakfasts">Number of Breakfasts</label>
              <select className="form-control" name="numBreakfasts" id="numBreakfasts" value={value} onChange={this.handleChange} type="number">
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

            <div className="form-group lunches col-md-3">
              <label htmlFor="numLunches">Number of Lunches</label>
              <select className="form-control" name="numLunches" id="numLunches" value={value} onChange={this.handleChange} type="number">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </select>
            </div>

            <div className="form-group dinners col-md-3">
              <label htmlFor="numDinners">Number of Dinners</label>
              <select className="form-control" name="numDinners" id="numDinners" value={value} onChange={this.handleChange} type="number">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </select>
            </div>

            <input type="submit" value="Create Plan" className="btn btn-primary col-md-3" />

          </div>

          <h3>Additional Filters</h3>

          <div className="row">

            <div className="form-group diet col-md-3">
              <h5>Food Preferences</h5>
              {allowedDiet.map(function(item, i){
                return [
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name='allowedDiet' value={item} className="checkbox" onChange={this.handleChange} />{item}
                    </label>
                  </div>
                ];
              }, this)}
            </div>

            <div className="form-group allergies col-md-3">
              <h5>Allergy Restrictions</h5>
              {allowedAllergies.map(function(item, i){
                return [
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name='allowedAllergies' value={item} className="checkbox" onChange={this.handleChange} />{item}
                    </label>
                  </div>
                ];
              }, this)}
            </div>

            <div className="form-group cuisines col-md-3">
              <h5>Cuisine Preferences</h5>
              {allowedCuisines.map(function(item, i){
                return [
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name='allowedCuisines' value={item} className="checkbox" onChange={this.handleChange} />{item}
                    </label>
                  </div>
                ];
              }, this)}
            </div>

          </div>
        </form>
      </div>
    );
  }
});


//TODO: Store all meal query options below and dynamically generate jsx in the render method above.
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
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Pescatarian",
  "Vegan",
  "Lacto-Ovo-Vegetarian",
  "Paleo"
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
