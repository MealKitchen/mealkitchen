var MealQuery = React.createClass({
  
  getInitialState: function() {
    return {
      this
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
    console.dir(thisQuery);
    thisQuery.save();
  },

  render: function() {
    var value = this.state.value;
    return (

    );
  }
});
