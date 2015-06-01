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

        //Create a Recipes Collection with Recipe Models for each Recipe returned from the server.
        _.each(res.matches, function(recipe){
          that.props.recipes.add(new RecipeModel(recipe));
        }, this);
        
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
      <form onSubmit={this.handleSubmit}>
        <input type="number" name="numMeals" placeholder="Enter number of meals" value={value} onChange={this.handleChange} />
        {allowedAllergies.map(function(item, i){
          return [
            <label><input type="checkbox" name={item} value={item} className="checkbox" onChange={this.handleChange} />{item}</label>
          ];
        }, this)}
        <input type="submit" />
      </form>
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
