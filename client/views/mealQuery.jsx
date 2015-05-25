var MealQuery = React.createClass({
  
  getInitialState: function() {
    return {
      numMeals: 0,
      allowedAllergy: {
        vegetarian: false,
        vegan: false,
        nutFree: false,
        glutenFree: false,
        carnivore: false
      }
    };
  },

  //Every time a user interacts with the form, we need to update the state of the view to reflect that change.
  handleChange: function(event) {
    var name = event.target.name;
    if(name === 'numMeals'){
      this.setState({numMeals: event.target.value});
    } else {
      var newAllergies = _.extend({}, this.state.allowedAllergy);
      newAllergies[name] = event.target.checked;
      this.setState({allowedAllergy: newAllergies});
    };
  },

  //TODO: Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var thisQuery = new QueryModel(this.state);
  },

  render: function() {
    var value = this.state.value;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="number" name="numMeals" placeholder="Enter number of meals" value={value} onChange={this.handleChange} />
        <label><input type="checkbox" name="vegetarian" value="vegetarian" class="checkbox" onChange={this.handleChange} /> Vegetarian</label>
        <label><input type="checkbox" name="vegan" value="vegan" class="checkbox" onChange={this.handleChange} /> Vegan</label>
        <label><input type="checkbox" name="nutFree" value="nut-free" class="checkbox" onChange={this.handleChange} /> Nut Free</label>
        <label><input type="checkbox" name="glutenFree" value="gluten-free" class="checkbox" onChange={this.handleChange} /> Gluten Free</label>
        <label><input type="checkbox" name="carnivore" value="carnivore" class="checkbox" onChange={this.handleChange} /> Carnivore</label>
        <input type="submit" />
      </form>
    );
  }
});

