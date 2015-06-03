/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var MealQuery = React.createClass({
  
  mixins: [Backbone.Events, Navigation],

  getInitialState: function() {
    return {};
  },

  //Set listener on state (which is a backbone model)
  componentDidMount: function(){
    this.listenTo(this.props.query, 'change', function(){
      console.log('heard a change event!');
    }, this);
    console.log(this.props);
  },

  //Every time a user interacts with the form, we need to update the state of the view to reflect that change.
  handleChange: function(event) {
    var name = event.target.name;
    if(name === 'numMeals'){
      this.setState({ numMeals: event.target.value,
                       totalRecipesRequested: event.target.value });
    } else {
      var newAllergies = _.extend({}, this.state.allowedAllergy);
      newAllergies[name] = event.target.checked;
      this.setState({allowedAllergy: newAllergies});
    }
  },

  //Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var that = this;

    //Send a POST request to the server with the QueryModel to get a list of recipes that match the query.
    this.props.query.set(this.state);
    this.props.query.save({}, {
      success: function(model, res){
        console.log("Response from the server on submitting Meal Query: ", res);
        var recipeQueue = res;
        for(var i=0; i<that.props.query.get('numMeals'); i++){
          that.props.recipes.add(new RecipeModel(recipeQueue.shift()));
        }
        
        //Set the recipeQueue as an attribute on the query model to pass to the reviewmeals view for reference.
        that.props.query.set({ 'recipeQueue': recipeQueue });
      
        that.transitionTo('reviewmeals');
      },
      error: function(model, err){
        console.error("There was an error with your Meal Query request! ", err);
      }
    });
  },

  render: function() {
    var value = this.state.value;
    return (
      <div className="mealQuery">
        <h2>Create a Meal Plan</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="numMeals">Number of Meals</label>
            <input type="number" className="form-control" name="numMeals" placeholder="Enter number of meals" value={value} onChange={this.handleChange} />
          </div>
          <div className="form-group allergyPreferences">
            <h5>Allergy Preferences</h5>
            {allowedAllergies.map(function(item, i){
              return [
                <div className="checkbox">
                  <label>
                    <input type="checkbox" name={item} value={item} className="checkbox" onChange={this.handleChange} />{item}
                  </label>
                </div>
              ];
            }, this)}
            <input type="submit" />
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
