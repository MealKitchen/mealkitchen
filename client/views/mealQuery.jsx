var MealQuery = React.createClass({
  render: function() {
    // var name = this.props.name;
    return (
      <form>
        <input type="number" placeholder="Enter number of meals" />
      
        <label><input type="checkbox" id="vegetarian" name="vegetarian" value="vegetarian" class="checkbox" /> Vegetarian</label>
        <label><input type="checkbox" id="vegan" name="vegan" value="vegan" class="checkbox" /> Vegan</label>
        <label><input type="checkbox" id="nut-free" name="nut-free" value="nut-free" class="checkbox" /> Nut Free</label>
        <label><input type="checkbox" id="gluten-free" name="gluten-free" value="gluten-free" class="checkbox" /> Gluten Free</label>
        <label><input type="checkbox" id="carnivore" name="carnivore" value="carnivore" class="checkbox" /> Carnivore</label>
        <input type="submit" />
      </form>
    );
  }
});

// React.render(<SearchBar />, document.body);
