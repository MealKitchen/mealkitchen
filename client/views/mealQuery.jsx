var MealQuery = React.createClass({
  
  getInitialState: function() {
    return {
      numMeals: 0,
      vegetarian: false,
      vegan: false,
      nutFree: false,
      glutenFree: false,
      carnivore: false
    };
  },

  handleChange: function(event) {
    name = event.target.name;
    if(name === 'numMeals'){
      this.setState({numMeals: event.target.value});
    } else {
      var newState = {};
      newState[name] = event.target.checked;
      this.setState(newState);
    }
  },

  handleSubmit: function(e){
    e.preventDefault();
    console.log(this.state);
    console.log();
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

// React.render(<SearchBar />, document.body);
