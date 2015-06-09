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
    this.props.query.set(this.state);
    console.log(this.props.query);
    this.props.query.save({}, {
      success: function(model, res){
        console.log("Response from the server on submitting Meal Query: ", res);

        //Generate recipe queues for breakfast, lunch, and dinner. The queues are sorted from 0-length where length is the closest to the user's palate. When a user rejects a recipe, the next recipe in the queue will be shown.
        var breakfastQ = res.breakfastRecipes;
        var lunchQ = res.lunchRecipes;
        var dinnerQ = res.dinnerRecipes;

        for(var i=0; i<that.props.query.get('numBreakfasts'); i++){
          that.props.breakfastCollection.add(new RecipeModel(breakfastQ.pop()));
        }

        for(i=0; i<that.props.query.get('numLunches'); i++){
          that.props.lunchCollection.add(new RecipeModel(lunchQ.pop()));
        }

        for(i=0; i<that.props.query.get('numDinners'); i++){
          that.props.dinnerCollection.add(new RecipeModel(dinnerQ.pop()));
        }

        //Set the recipeQueue as an attribute on the query model to pass to the reviewmeals view for reference.
        that.props.query.set({
          'breakfastQ': breakfastQ,
          'lunchQ': lunchQ,
          'dinnerQ': dinnerQ
        });

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
      <div className="query">
        <h2>Create Meal Plan</h2>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group breakfasts">
            <label htmlFor="breakfasts">Number of Breakfasts</label>
            <input type="number" className="form-control" name="numBreakfasts" placeholder="Enter number of breakfasts" value={value} onChange={this.handleChange} />
          </div>

          <div className="form-group lunches">
            <label htmlFor="lunches">Number of Lunches</label>
            <input type="number" className="form-control" name="numLunches" placeholder="Enter number of lunches" value={value} onChange={this.handleChange} />
          </div>

          <div className="form-group dinners">
            <label htmlFor="dinners">Number of Dinners</label>
            <input type="number" className="form-control" name="numDinners" placeholder="Enter number of dinners" value={value} onChange={this.handleChange} />
          </div>

          <input type="submit" />

          <div className="form-group diet">
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

          <div className="form-group allergies">
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

          <div className="form-group cuisines">
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
