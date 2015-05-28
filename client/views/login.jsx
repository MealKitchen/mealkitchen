/** @jsx React.DOM */
var Login = React.createClass({
  
  mixins: [Backbone.Events],

  getInitialState: function() {
    return new UserModel(); 
  },

  //Set listener on state (which is a backbone model)
  componentDidMount: function(){
    this.listenTo(this.state, 'change', function(){
      console.log('heard a change event!');
    }, this);
  },

  //Every time a user interacts with the form, we need to update the state of the view to reflect that change.
  handleChange: function(event) {
    if(event.target.name === 'email'){
      this.state.set('email', event.target.value);
    } else {
      this.state.set('password', event.target.value);
    };
  },

  //Send the state to a backbone model to be sent to Yummly
  handleSubmit: function(e){
    e.preventDefault();
    var that = this;
    
    //Send a POST request to the server with the QueryModel to get a list of recipes that match the query.
    this.state.fetch({}, {
      success: function(model, res){
        console.log("Response from the server: ", res);

        
      },
      error: function(model, err){
        console.error("There was an error with your request! ", err);
      }
    }); 
  },

  render: function() {
    return (
      <form name="login" onSubmit={this.handleSubmit}>
        <ul>
          <li><label for="email">Email</label>
          <input type="email" name="email" placeholder="youremail@email.com" required /></li>
          <li><label for="password">Password</label>
          <input type="password" name="password" placeholder="password" required /></li>
          <li>
          <input type="submit" value="Login" /></li>
        </ul>
      </form>
    );
  }
});

