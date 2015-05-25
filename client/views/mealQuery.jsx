var MealQuery = React.createClass({
  
  getInitialState: function() {
    return {
      "numMeals": 0,
      "allowedAllergy": {
        "Egg-Free": false,
        "Gluten-Free": false,
        "Peanut-Free": false,
        "Seafood-Free": false,
        "Sesame-Free": false,
        "Soy-Free": false,
        "Sulfite-Free": false,
        "Tree Nut-Free": false,
        "Wheat-Free": false
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
        <label><input type="checkbox" name="Egg-Free" value="Egg-Free" class="checkbox" onChange={this.handleChange} /> Egg-Free</label>
        <label><input type="checkbox" name="Gluten-Free" value="Gluten-Free" class="checkbox" onChange={this.handleChange} /> Gluten-Free</label>
        <label><input type="checkbox" name="Peanut-Free" value="Peanut-Free" class="checkbox" onChange={this.handleChange} /> Peanut-Free</label>
        <label><input type="checkbox" name="Seafood-Free" value="Seafood-Free" class="checkbox" onChange={this.handleChange} /> Seafood-Free</label>
        <label><input type="checkbox" name="Sesame-Free" value="Sesame-Free" class="checkbox" onChange={this.handleChange} /> Sesame-Free</label>
        <label><input type="checkbox" name="Soy-Free" value="Soy-Free" class="checkbox" onChange={this.handleChange} /> Soy-Free</label>
        <label><input type="checkbox" name="Sulfite-Free" value="Sulfite-Free" class="checkbox" onChange={this.handleChange} /> Sulfite-Free</label>
        <label><input type="checkbox" name="Tree Nut-Free" value="Tree Nut-Free" class="checkbox" onChange={this.handleChange} /> Tree Nut-Free</label>
        <label><input type="checkbox" name="Wheat-Free" value="Wheat-Free" class="checkbox" onChange={this.handleChange} /> Wheat-Free</label>
        <input type="submit" />
      </form>
    );
  }
});

